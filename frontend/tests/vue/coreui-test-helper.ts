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
} from "@/patches"

import { CIcon } from "@coreui/icons-vue";
//-----------------------------------------------------------------------------
import { GlobalMountOptions } from "@vue/test-utils/dist/types";
//-----------------------------------------------------------------------------
export function getGlobalMountOptionsForCoreUi(): GlobalMountOptions {
    const icons = {};

    return {
        provide: {
            icons
        },
        directives: {
            "c-tooltip": vctooltip
        },
        components: {
            CContainer,
            CRow,
            CCol,
            CButton,
            CForm,
            CFormLabel,
            CFormInput,
            CIcon
        }
    };
}
