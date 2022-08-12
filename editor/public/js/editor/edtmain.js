import * as Calc from './elib/calc.js';
import ListenerGroup from './elib/listenergroup.js';

window.Editor = {
  Calc: Calc,
  ListenerGroup: ListenerGroup,
  current: null
};

Editor.load = type => {
 return new Promise(async function(resolve, reject) {
   const html = await System.ajax.getText(`/page/${type}.html`);
   document.querySelector('.wrapper').innerHTML = html;
   document.dispatchEvent(new CustomEvent('pageloaded', {detail: type}));
 });

}
