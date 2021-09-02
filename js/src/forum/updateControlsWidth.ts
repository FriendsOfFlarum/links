export default function updateControlsWidth(adjustment: number = 0) {
  const viewportWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);

  const navigationEl: HTMLDivElement = document.querySelector('#header-navigation')!;
  const controlsElement: HTMLDivElement = document.querySelector('#header-primary .Header-controls')!;
  const headerTitleEl: HTMLDivElement = document.querySelector('.Header-title')!;
  const headerSecondaryEl: HTMLDivElement = document.querySelector('#header-secondary')!;
  const headerContainerEl: HTMLDivElement = document.querySelector('#header .container')!;

  // Left padding is handled by the navigation width
  const headerContainerWidth = headerContainerEl.getBoundingClientRect().width - parseInt(getComputedStyle(headerContainerEl).paddingRight);
  const titleWidth = headerTitleEl.getBoundingClientRect().width + parseInt(getComputedStyle(headerTitleEl).marginRight);
  const secondaryHeaderWidth = headerSecondaryEl.getBoundingClientRect().width;
  const navigationWidth = navigationEl.getBoundingClientRect().width + parseInt(getComputedStyle(navigationEl).marginRight);

  let availableControlsWidth = headerContainerWidth - titleWidth - secondaryHeaderWidth;

  if (viewportWidth > 1160) {
    availableControlsWidth -= parseInt(getComputedStyle(headerContainerEl).paddingLeft);
  } else {
    availableControlsWidth -= navigationWidth;
  }

  // 12px padding and not a decimal
  let controlsMaxWidth = Math.floor(availableControlsWidth - 12);

  if (adjustment) controlsMaxWidth += adjustment;

  controlsElement.style.setProperty('--controls-max-width', `${controlsMaxWidth}px`);
}
