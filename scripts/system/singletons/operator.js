import SignalObject from "../objects/signalobject.js";
const Operator = new SignalObject( );
export default Operator;
//==========================================================
// Define Properties
//==========================================================
Object.assign( Operator, { methods: { } });
//==========================================================
//  Function to add method to runlist
//==========================================================
Operator.add = function( key, method ) {
    this.methods[key] = method;
}
//==========================================================
// Function to remove a method from runlist
//==========================================================
Operator.remove = function(key) {
    delete this.methods[key];
}
//==========================================================
// Update - loops through and runs any cached methods
//==========================================================
Operator.update = function(timestamp) {
    for(const method in this.methods) method( timestamp);
}
//==========================================================
//
//==========================================================
//==========================================================
//  Perform Update Loop
//==========================================================
requestAnimationFrame( Operator.update.bind(Operator) );