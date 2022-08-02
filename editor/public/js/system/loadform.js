const dp = new DOMParser( );

export async function loadForm(element, type) {
  try{
    const src = await fetch(`/forms/${type}.html`).then(res => res.text( ));
    const content = parseSrc(src);
    element.innerHTML = content[0];
    element.querySelector('form').onsubmit = event => {handleSubmit(event, element)};
    eval(content[1]);
  } catch (err) {
    throw err;
  }
}

function parseSrc(src) {
  const dom = dp.parseFromString(src, 'text/html');
  const parts = dom.body.querySelectorAll('exp');
  return [parts[0].innerHTML, parts[1].textContent]
}

async function loadHTML(element, type) {
  try {
    const text = await fetch(`/forms/${type}.html`).then(res => res.text());
    element.innerHTML(element);
  } catch(err) {
    throw err;
  }
}

async function execJS(element, type) {
  try {
    const text = await fetch(`/forms/${type}.js`).then(res => res.text());
    exec(text);
  } catch(err) {
    throw err;
  }
}

function handleSubmit(event, element) {
  event.preventDefault( );
  const fd = new FormData(event.target);
  const res = { };
  for(const key of fd.keys( )) {
    res[key] = fd.getAll(key);
    res.formid = event.target.id;
  }
  element.classList.remove('show')
  document.dispatchEvent(new CustomEvent('formsubmission', {detail: res}));
}
