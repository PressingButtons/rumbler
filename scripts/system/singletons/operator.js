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
    Operator.methods[key] = method;
}
//==========================================================
// Function to remove a method from runlist
//==========================================================
Operator.remove = function(key) {
    delete Operator.methods[key];
}
//==========================================================
// Update - loops through and runs any cached methods
//==========================================================
Operator.update = function(timestamp) {
    for(const key in Operator.methods) Operator.methods[key]( timestamp );
    requestAnimationFrame( Operator.update);
}
//==========================================================
//
//==========================================================
//==========================================================
//  Perform Update Loop
//==========================================================
requestAnimationFrame( Operator.update.bind(Operator) );