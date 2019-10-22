// import { FormBuilder, Validators, Control, ControlGroup, FORM_DIRECTIVES } from '@angular/forms'


// export class GlobalValidator{

//     static mailFormat(control: Control): ValidationResult {

//         var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

//         if (control.value != "" && (control.value.length <= 5 || !EMAIL_REGEXP.test(control.value))) {
//             return { "incorrectMailFormat": true };
//         }

//         return null;
//     }

// }

// interface ValidationResult {
//     [key: string]: boolean;
// }