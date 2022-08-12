export default class listenerGroup {

  #listeners = [ ];

  constructor( ) {

  }

  bindElement(element, eventname, func) {
    element.addEventListener(eventname, func);
    this.#listeners.push({element: element, eventname: eventname, func: func});
    return element;
  }

  unbind(element) {
    for(const listener of this.#listeners)
      if(listener.element != element) continue;
      else element.removeListener(listener.eventname, listener.func)
    return element;
  }

  unbindAll( ) {
    for(const listener of this.#listeners)
      listener.element.removeEventListener(listener.eventname, listener.func)
  }

}
