export default class ContentFile extends EventTarget {

  static JSON = 'application/json';
  static IMAGE = 'image/webp';

  #url;
  #content_type;
  #subfiles = { };

  constructor(fileURL, content_type) {
    super( );
    this.data = { };
    this.#url = fileURL;
    this.#content_type = content_type
  }

  get subfiles( ) {
    return this.#subfiles;
  }

  get content_type( ) {
    return this.#content_type;
  }

  get url( ){
    this.#url;
  }

  addfile(name, file) {
    this.#subfiles[name] = file;
  }

  async load( ) {
    if(this.content_type == ContentFile.IMAGE) this.data = await System.loadImage( );
    for(const filename in this.#subfiles) await this.#subfiles[filename].load( );
  }

  async save( ) {
    let subfiles = await this.#saveSubfiles( );
    let data = this.#pack( );
    let pkg = Object.assign({ }, subfiles, data);
    await fetch(this.#url, {
      method: 'POST',
      headers: {'Content-Type': this.#content_type},
      body: pkg
    });
  }

  #handleLoadResponse(response) {
    switch (this.#content_type) {
      case ContentFile.JSON: this.data = response.json( ); break;
      case ContentFile.IMAGE: this.data = this.#loadCanvas(this.#url); break;
      default: this.data = response.text( ); break;
    }
    return;
  }

  async #loadCanvas(url) {
    const source = await System.loadImage(url);
    const context = System.createContext2D(source.width, source.height);
    return context.drawImage(source, 0, 0);
  }

  #pack( ) {
    if(this.#content_type == ContentFile.JSON) return JSON.stringify(this.data);
    if(this.#content_type == ContentFile.IMAGE) return this.data.canvas.toDataURL('image/webp', 1.0);
    else return this.data;
  }

  async #saveSubfiles( ) {
    let subfiles = { };
    for(const filename in this.#subfiles) {
      await this.#subfiles[filename].save( )
      subfiles[filename] = this.#subfiles[filename].url;
    }
  }

}
