/**
 * Errors on:
 * - Symbols
 * - Functions
 */
export namespace diff {
  // garbled name to avoid conflicts
  const DiffKinds = {
    CREATED: "$!dv_created",
    UPDATED: "$!dv_updated",
    DELETED: "$!dv_deleted",
    UNCHANGED: "$!dv_unchanged",
  } as const;
  export type DiffKind = (typeof DiffKinds)[keyof typeof DiffKinds];
  type Value = null | undefined | boolean | number | bigint | string | symbol;

  type DiffKey = string | number;

  export type DiffVal = {
    kind: DiffKind;
    data: Value;
  };

  export const isDiffVal = (o: any): o is DiffVal =>
    (o as DiffVal)?.kind !== undefined &&
    Object.values(DiffKinds).includes(o.kind);

  export type Diff = {
    [key: DiffKey]: Diff | DiffVal;
  };

  const valueChange = (v1: Value, v2: Value): DiffKind => {
    if (v1 === v2) {
      return DiffKinds.UNCHANGED;
    }
    if (isDate(v1) && isDate(v2) && v1.getTime() === v2.getTime()) {
      return DiffKinds.UNCHANGED;
    }
    if (v1 === undefined) {
      return DiffKinds.CREATED;
    }
    if (v2 === undefined) {
      return DiffKinds.DELETED;
    }
    return DiffKinds.UPDATED;
  };

  const isBase = <T>(o: any, name: string): o is T =>
    Object.prototype.toString.call(o) === name;

  const isFunction = (o: any): o is Function => isBase(o, "[object Function]");
  const isArray = (o: any): o is Array<any> => isBase(o, "[object Array]");
  const isDate = (o: any): o is Date => isBase(o, "[object Date]");
  const isObject = (o: any): o is object => isBase(o, "[object Object]");
  const isSymbol = (o: any): o is Symbol => isBase(o, "[object Symbol]");
  const isValue = (o: any): o is Value => !isObject(o) && !isArray(o);

  const isEmptyObject = (o: object): boolean => Object.keys(o).length === 0;

  const throwIfUndiffable = (...os: any[]) => {
    for (const o of os) {
      if (isFunction(o)) {
        throw "invalid diff on function";
      }
      if (isSymbol(o)) {
        throw "invalid diff on symbol";
      }
    }
  };

  type MapIterStep = {
    wb: [Diff, DiffKey]; // writeback
    o1: any;
    o2: any;
  };

  const mapIter = ({ wb, o1, o2 }: MapIterStep): MapIterStep[] => {
    throwIfUndiffable(o1, o2);

    if (isValue(o1) || isValue(o2)) {
      const kind = valueChange(o1, o2);
      if (kind !== DiffKinds.UNCHANGED) {
        wb[0][wb[1]] = {
          kind,
          data: o1 === undefined ? o2 : o1,
        };
      }
      return [];
    }

    if (isEmptyObject(o1) || isEmptyObject(o2)) {
      if (isEmptyObject(o1) && isEmptyObject(o2)) return [];

      if (isEmptyObject(o1)) {
        wb[0][wb[1]] = {
          kind: o2 === undefined ? DiffKinds.DELETED : DiffKinds.UPDATED,
          data: o1,
        };

        return [];
      }

      if (isEmptyObject(o2)) {
        wb[0][wb[1]] = {
          kind: DiffKinds.CREATED,
          data: o2,
        };
        return [];
      }
    }

    const next: MapIterStep[] = [];
    const skip = new Set();
    const diff: Diff = {};
    for (const k in o1) {
      next.push({ wb: [diff, k], o1: o1[k], o2: o2[k] });
      skip.add(k);
    }
    for (const k in o2) {
      if (skip.has(k)) continue;
      next.push({ wb: [diff, k], o1: undefined, o2: o2[k] });
    }
    wb[0][wb[1]] = diff;

    return next;
  };

  const writebackAllKeys = <T>(o: T): [T, DiffKey][] =>
    Object.keys(o).map((k): [T, DiffKey] => [o, k]);

  export const map = (o1: any, o2: any): Diff => {
    throwIfUndiffable(o1, o2);

    const root: Diff = { diff: {} };

    const next = mapIter({ wb: [root, "diff"], o1, o2 });
    for (const i of next) {
      next.push(...mapIter(i));
    }

    // post-order traverse tree for empty nodes
    const check = writebackAllKeys(root);
    for (const [p, k] of check) {
      const v = p[k];
      if (isDiffVal(v)) continue;
      check.push(...writebackAllKeys(v));
    }

    for (let i = check.length - 1; i >= 0; i--) {
      const [p, k] = check[i];
      if (isEmptyObject(p[k])) {
        delete p[k];
      }
    }

    return root.diff as Diff;
  };

  type UndoIterStep = {
    wb: any; // writeback
    diff: Diff;
    key: DiffKey;
  };

  const undoIter = ({ wb, diff, key }: UndoIterStep): UndoIterStep[] => {
    if (isDiffVal(diff[key])) {
      if (diff[key].kind === DiffKinds.CREATED) {
        if (isArray(wb)) {
          wb.splice(key as number, 1);
        } else {
          delete wb[key];
        }
      }
      if (
        diff[key].kind === DiffKinds.DELETED ||
        diff[key].kind == DiffKinds.UPDATED
      ) {
        wb[key] = diff[key].data;
      }
      return [];
    } else {
      if (diff[key] === undefined) return [];
      if (wb[key] === undefined) {
        wb[key] = {};
      }
      return Object.keys(diff[key]).map(
        (nk): UndoIterStep => ({
          diff: diff[key] as Diff,
          wb: wb[key],
          key: nk,
        })
      );
    }
  };

  export const undo = (o: any, diff: Diff): any => {
    const rootObj = { root: o };
    const rootDiff = { root: diff };
    const next: UndoIterStep[] = [
      {
        wb: rootObj,
        diff: rootDiff,
        key: "root",
      },
    ];
    for (const step of next) {
      next.push(...undoIter(step));
    }

    return o;
  };
}
