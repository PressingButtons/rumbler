export default class DataFile {

  static JSON = 'application/json';
  static IMAGE = 'image/webp';

  constructor(url, content_type) {
    Object.defineProperties({
      url: {value: url},
      data: {value: { }},
      subfiles: {value: { }},
      content_type: {value: content_type}
    })
  }

  async load( ) {
    if(this.content_type == DataFile.IMAGE) this.data = await System.loadCanvas(this.url);
    for(const filename in this.subfiles) await this.subfiles[filename].load( );
  }

  save( ) {
    const outfile = this.#createOutFile( );
    return System.postData(this.url, outfile, this.content_type);
  }

  //private
  #createOutFile( ) {
    let subfiles = this.#getSubFiles( );
    let data = this.#pack( );
    return {data: data, subfiles: subfiles}
  }

  #getSubFiles( ) {
    let files = Object.assign({ }, this.subfiles);
    for(var filename in files) files[filename] = files[filename].url;
    return files;
  }

  #pack( ) {
    switch (this.content_type) {
      case DataFile.IMAGE: return this.data.canvas.getImageData(0, 0, this.data.canvas.width, this.data.canvas.height).data; break;
      case DataFile.IMAGE: return JSON.stringify(this.data); break;
      default: return this.data;
    }
  }
}
