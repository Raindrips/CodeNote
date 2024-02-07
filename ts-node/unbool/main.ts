
import { UnitedBool } from "./UnitedBool";
import { BitSet } from "./BoolUtils";

function Test() {
    let s = new BitSet();
    s.set(1, true);
    s.set(1, false)
    s.set(2, true);
    s.set(3, false)
    s.set(2, true);
    s.set(6, false)
    s.print();
}

function main() {
    Test();
}


main();