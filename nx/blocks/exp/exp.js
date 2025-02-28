import { LitElement, html, nothing } from 'da-lit';
import { getConfig } from '../../scripts/nexter.js';
import getStyle from '../../utils/styles.js';
import getSvg from '../../utils/svg.js';

import './sl.js';
import '../profile/profile.js';

const { nxBase } = getConfig();

const style = await getStyle(import.meta.url);

const ICONS = [
  `${nxBase}/img/icons/S2IconUsersNo20N-icon.svg`,
];

/* eslint-disable no-bitwise */
const stringToColour = (str) => {
  let hash = 0;
  str.split('').forEach((char) => {
    hash = char.charCodeAt(0) + ((hash << 5) - hash);
  });
  let colour = '#';
  for (let i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    colour += value.toString(16).padStart(2, '0');
  }
  return colour;
};
/* eslint-enable no-bitwise */

function calcAbbrev(name) {
  const [cap, lower] = name.slice(0, 2).split('');
  return `${cap.toUpperCase()}${lower}`;
}

class NxExp extends LitElement {
  static properties = {
    _loaded: { state: true },
    _details: { state: true },
  };

  async connectedCallback() {
    super.connectedCallback();
    getSvg({ parent: this.shadowRoot, paths: ICONS });
    this.shadowRoot.adoptedStyleSheets = [style];
    this._details = (await import('./data-model.js')).default;
  }

  handleProfileLoad() {
    this._loaded = true;
  }

  async handleNew() {
    this._details = (await import('./data-model.js')).default;
  }

  handleTypeChange() {
    console.log('Hello');
  }

  handleOpen(e, idx) {
    e.preventDefault();
    // Close if already open
    console.log(this._details);

    const isOpen = this._details.variants[idx].open;
    if (isOpen) {
      this._details.variants[idx].open = false;
    } else {
      // Loop through all and close
      this._details.variants.forEach((variant) => {
        variant.open = false;
      });
      this._details.variants[idx].open = true;
    }
    this.requestUpdate();
  }

  renderHeader() {
    return html`
      <div class="nx-exp-header">
        <h1>Experimentation</h1>
        <nx-profile @loaded=${this.handleProfileLoad}></nx-profile>
      </div>
    `;
  }

  renderNew() {
    return html`
      <div class="nx-new-wrapper">
        <div class="nx-new">
          <img src="${nxBase}/img/icons/S2IconUsersNo20N-icon.svg" alt="" class="nx-new-icon" />
          <h2 class="spectrum-Heading spectrum-Heading--sizeS">No experiments on this page</h2>
          <p class="spectrum-Body spectrum-Body--sizeS nx-new-body">
            Create a new experiment to start optimizing your web page.
          </p>
          <sp-button-group class="nx-new-buttons">
            <sp-button variant="secondary">View docs</sp-button>
            <sp-button @click=${this.handleNew}>Create new</sp-button>
          </sp-button-group>
        </div>
      </div>
    `;
  }

  renderVariants() {
    return html`
      <h2 class="spectrum-Heading spectrum-Heading--sizeXS nx-space-bottom-200">Variants</h2>
      <ul class="nx-variants-list nx-space-bottom-300">
        ${this._details.variants.map((variant, idx) => html`
          <li class="${variant.open ? 'is-open' : ''}">
            <span style="background: ${stringToColour(variant.name)}">
              ${calcAbbrev(variant.name)}
            </span>
            <p>${variant.name}</p>
            <div class="sl-inputfield">
              <input type="range" id="split" name="volume" min="0" max="100" />
            </div>
            <button @click=${(e) => this.handleOpen(e, idx)} class="sl-button sl-button-icon-only nx-exp-btn-more">Details</button>
          </li>
        `)}
      </ul>
    `;
  }

  renderDate() {
    return html`
      <div class="sl-fieldgroup sl-fieldgroup-two-up nx-space-bottom-300">
        <div class="sl-inputfield nx-space-bottom-100">
          <label for="nx-input-exp-name">Start date</label>
          <input type="date" id="start" name="trip-start" value="2018-07-22" min="2018-01-01" max="2018-12-31" />
        </div>
        <div class="sl-inputfield nx-space-bottom-100">
          <label for="nx-input-exp-name">Start date</label>
          <input type="date" id="start" name="trip-start" value="2018-07-22" min="2018-01-01" max="2018-12-31" />
        </div>
      </div>
    `;
  }

  renderDetails() {
    return html`
      <form class="nx-details">
        <h2 class="spectrum-Heading spectrum-Heading--sizeS nx-space-bottom-200">Edit experiment</h2>
        <hr class="sl-rule"></div>
        <sl-input name="project-name" label="Name" placeholder="Enter experimentation name"></sl-input>


        <div class="sl-fieldgroup sl-fieldgroup-two-up nx-space-bottom-300">
          <sl-select @change=${this.handleTypeChange}>
            <option>A/B test</option>
            <option>MAB</option>
          </sl-select>

          <div class="sl-inputfield">
            <label for="nx-input-exp-opt-for">Optimizing for</label>
            <div class="sl-inputfield-select-wrapper">
              <select id="nx-input-exp-opt-for">
                <option>Overall conversion</option>
                <option>Form submission</option>
                <option>Engagement</option>
              </select>
            </div>
          </div>
        </div>
        <hr class="sl-rule"></div>
        ${this.renderVariants()}
        ${this.renderDate()}
      </form>
    `;
  }

  render() {
    return html`
      ${this.renderHeader()}
      <sp-theme system="spectrum-two" scale="medium" color="light">
        ${this._loaded ? html`${this._details ? this.renderDetails() : this.renderNew()}` : nothing}
      </sp-theme>
    `;
  }
}

customElements.define('nx-exp', NxExp);

export default function init() {
  document.body.style = 'max-width: 374px; margin: 0 auto; background: #000';
  const exp = document.createElement('nx-exp');
  document.body.append(exp);
}
