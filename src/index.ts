console.log("hello :DDDD");

type Side = "atk" | "def";

type Strat = {
    side: Side;
};

let a: Strat = { side: "def" };

console.log(a.side);
