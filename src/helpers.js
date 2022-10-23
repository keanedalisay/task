export function delegateEvent(elem, event, slctr, func) {
  elem.addEventListener(event, (e) => {
    if (e.target.matches(slctr)) func();
  });
  return;
}

export function insertHTML(elem, html) {
  elem.insertAdjacentHTML("afterbegin", html);
  return;
}

export function setTabIndex(elements) {
  elements.forEach((elem) => {
    const tabIndex = parseInt(elem.getAttribute("tabindex"));
    elem.setAttribute("tabindex", tabIndex ? 0 : -1);
  });
  return;
}

export function goalLabelHTML() {
  const goalLabel = `
    <div class="progressBar">
        <div class="progressBar-interval">
        </div>
    </div>
    <input class="goalInput" type="text" placeholder="Goal Name...">
    <label class="goalLabel hide-elem"></label>
    `;
  return goalLabel;
}
