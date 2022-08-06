export default class ProjectTemplate {

  #url;
  #config = {

  };

  constructor(path, config) {
    this.#url = path;
    this.#config = config;
  }

  async load(path) {
    const data = await fetch(`/data/${path}.json`).then(response => response.json( ));
    for(var name in this.#config) this.#config[name] = data[name];
  }

  async save( ) {
    return fetch(`/data/${this.#url}.json`, {
      method: "POST",
      headers: {'Content-Type': "application/json"},
      body: JSON.stringify(this.#data)
    })
  }

  get data ( ) {
    return this.#config;
  }

}
