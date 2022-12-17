// 自定義註冊
// 驗證

// 載入vee-validate 為了驗證所設計的 Form與Field ，防止命名衝突使用as重新命名
import {
  Form as VeeForm,
  Field as VeeField,
  defineRule,
  ErrorMessage,
  configure,
} from "vee-validate";
// 載入rules的required
import {
  required,
  min,
  max,
  alpha_spaces as alphaSpaces,
  email,
  min_value as minVal,
  max_value as maxVal,
  confirmed,
  not_one_of as excluded,
} from "@vee-validate/rules";

// 載入i18n
// import { localize, setLocale } from "@vee-validate/i18n";
// import zhTW from "@vee-validate/i18n/dist/locale/zh_TW.json";
export default {
  install(app) {
    app.component("VeeForm", VeeForm);
    app.component("VeeField", VeeField);
    app.component("ErrorMessage", ErrorMessage);

    // 註冊新規則
    defineRule("required", required);
    defineRule("tos", required);
    defineRule("min", min);
    defineRule("max", max);
    defineRule("alpha_spaces", alphaSpaces);
    defineRule("email", email);
    defineRule("min_value", minVal);
    defineRule("max_value", maxVal);
    defineRule("passwords_mismatch", confirmed);
    defineRule("excluded", excluded);
    defineRule("country_excluded", excluded);

    // TODO 更改提示語
    configure({
      generateMessage: (ctx) => {
        const messages = {
          required: ` 此欄位不得為空`,
          min: `  太短了`,
          max: `  太長了`,
          alpha_spaces: `The field ${ctx.field} may only contain alphabetical characters and spaces.`,
          email: ` 信箱格式錯誤`,
          min_value: `The field ${ctx.field} is too low.`,
          max_value: `The field ${ctx.field} is too hight.`,
          excluded: ` 此密碼不被允許`,
          passwords_mismatch: `密碼不一致`,
          tos: `請同意`,
        };
        const message = messages[ctx.rule.name]
          ? messages[ctx.rule.name]
          : `The field ${ctx.field} is invalid`;
        return message;
      },
      validateOnBlur: true,
      validateOnChange: true,
      validateOnInput: false,
      validateOnModelUpdate: true,
    });
    // 註冊i18n

    // configure({
    //   generateMessage: localize({ zh_TW: zhTW }),
    //   validateOnBlur: true,
    //   validateOnChange: true,
    //   validateOnInput: false,
    //   validateOnModelUpdate: true,
    // });
    // setLocale("zh_TW");
  },
};
