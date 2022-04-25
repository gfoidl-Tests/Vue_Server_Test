// Only one of both needed.
// CoreUI has sometimes a bit strange styling (colors like pink), so just use
// Bootstrap for styling.
//-----------------------------------------------------------------------------
// import "@coreui/coreui/dist/css/coreui.css";
import "bootstrap/dist/css/bootstrap.css";
//-----------------------------------------------------------------------------
import { app } from "./app";

import {
    CContainer,
    CRow,
    CCol,
    CButton,
    CForm,
    CFormLabel,
    CFormInput
} from "@coreui/vue";

import {
    vctooltip
} from "@coreui/vue";

import { CIcon } from "@coreui/icons-vue";
//-----------------------------------------------------------------------------
export default function setupCoreUI(): void {
    app.component(CContainer.name, CContainer);
    app.component(CRow.name      , CRow);
    app.component(CCol.name      , CCol);
    app.component(CButton.name   , CButton);
    app.component(CForm.name     , CForm);
    app.component(CFormLabel.name, CFormLabel);
    app.component(CFormInput.name, CFormInput);
    app.component(CIcon.name     , CIcon);

    app.directive("c-tooltip", vctooltip);

    console.debug("[CoreUI] registered components, directives");
}
