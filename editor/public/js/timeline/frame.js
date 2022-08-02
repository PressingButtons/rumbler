export default function TimelineFrame(frame) {

  const container = document.createElement('div');

  container.innerHTML = `
    <div class="frame" style="width: 100px; min-width: 100px">
      <div class="flex cell">
        <p>Cell</p>
        <p class='cindex'>0</p>
      </div>
      <div class="flex col">
        <p>Duration</p>
        <div flex="flex">
        <span class='cduration'>100</span>
        <span>ms</span>
        </div>
      </div>
    </div>
  `

  frame.addEventListener('update', function(event) {
    const data = event.target.data;
    container.querySelector('.cindex').innerHTML = data.index;
    container.querySelector('.cduration').innerHTML = data.duration;
    container.querySelector('.frame').style.width = `${data.duration}px`;
  });

  return {
    get body( ) {return container}
  }

}
