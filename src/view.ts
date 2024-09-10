import Konva from "konva";
import { konvaImageFromUrl, konvaMakeStageZoomable } from "./util";

export class StageView {
  stage: Konva.Stage;
  floors: FloorView[];

  constructor(floors: FloorView[]) {
    this.floors = floors;
    this.stage = new Konva.Stage({
      container: "container",
      width: 700,
      height: 500,
      draggable: true,
    });
    for (const floor of this.floors) {
      this.stage.add(floor.bp.layer);
      this.stage.add(floor.pieces.layer);
    }
    konvaMakeStageZoomable(this.stage);
  }
}

export class BlueprintView {
  layer: Konva.Layer;
  image: Konva.Image;

  private constructor(layer: Konva.Layer, image: Konva.Image) {
    this.layer = layer;
    this.image = image;
  }

  static async new(url: string) {
    const ret = new BlueprintView(
      new Konva.Layer(),
      await konvaImageFromUrl(url)
    );
    ret.layer.add(ret.image);
    return ret;
  }
}

export type FloorView = {
  bp: BlueprintView;
  pieces: PiecesView;
};

export class PiecesView {
  layer: Konva.Layer;
  pieces: PieceView[];

  constructor() {
    this.layer = new Konva.Layer();
    this.pieces = [];
  }

  async addPiece(url: string) {
    const piece = await PieceView.new(url);

    this.layer.add(piece.image);
    this.pieces.push(piece);
  }
}

export class PieceView {
  image: Konva.Image;

  private constructor(image: Konva.Image) {
    this.image = image;
  }

  static async new(url: string) {
    const ret = new PieceView(await konvaImageFromUrl(url));
    ret.image.setDraggable(true);
    ret.image.on("mouseover", () => (document.body.style.cursor = "pointer"));
    ret.image.on("mouseout", () => (document.body.style.cursor = "default"));

    ret.image.on('dragstart', function () {
      console.log("x: ", ret.image.x(), "y: ", ret.image.y());
    })

    ret.image.on('dragend', function () {
      ret.image.x()
      ret.image.y()
    })

    return ret;
  }
}

export const makeView: () => Promise<StageView> = async () => {
  const pieces = new PiecesView();

  pieces.addPiece("/assets/Ops/Icons/grid.png");

  const floor = {
    bp: await BlueprintView.new(
      "/assets/maps/consulate/ConsulateRWTopFloorB.jpg"
    ),
    pieces,
  };

  return new StageView([floor]);
};
