// Only one of both needed.
// CoreUI has sometimes a bit strange styling (colors like pink), so just use
// Bootstrap for styling.
//-----------------------------------------------------------------------------
// import "@coreui/coreui/dist/css/coreui.css";
import "bootstrap/dist/css/bootstrap.css";
//-----------------------------------------------------------------------------
import { App } from "vue";

import {
    CContainer,
    CRow,
    CCol,
    CButton,
    CForm,
    CFormLabel,
    // CFormInput,          // use patched version instead
} from "@coreui/vue";

// Patched versions:
import {
    CFormInput,
    vctooltip
} from "./patches"

import { CIcon } from "@coreui/icons-vue";
import {
    cilActionRedo,
    cilActionUndo,
    cilTrash
} from "@coreui/icons";
//-----------------------------------------------------------------------------
function registerIcons(app: App): void {
    const icons = {
        cilActionRedo,
        cilActionUndo,
        cilTrash
    };

    app.provide("icons", icons);
}
//-----------------------------------------------------------------------------
export default function setupCoreUI(app: App): void {
    app.component(CContainer.name, CContainer);
    app.component(CRow.name      , CRow);
    app.component(CCol.name      , CCol);
    app.component(CButton.name   , CButton);
    app.component(CForm.name     , CForm);
    app.component(CFormLabel.name, CFormLabel);
    app.component(CFormInput.name, CFormInput);
    app.component(CIcon.name     , CIcon);

    app.directive("c-tooltip", vctooltip);

    registerIcons(app);

    console.debug("[CoreUI] registered components, directives");
}
