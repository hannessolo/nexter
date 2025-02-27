import { LitElement, html } from 'da-lit';
import getStyle from '../../utils/styles.js';
import { loadIms } from '../../utils/ims.js';
import '../profile/profile.js';

const style = await getStyle(import.meta.url);

class NxExp extends LitElement {
  static properties = {
    _signedIn: { state: true },
  }

  async connectedCallback() {
    super.connectedCallback();
    this.shadowRoot.adoptedStyleSheets = [style];
  }

  render() {
    return html`
      <div class="nx-exp-header">
        <h1>Experimentation</h1>
        <nx-profile></nx-profile>
      </div>`;
  }
}

customElements.define('nx-exp', NxExp);

export default function init() {
  const exp = document.createElement('nx-exp');
  document.body.append(exp);
}
