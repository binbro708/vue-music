<template>
  <!-- Registration Form -->
  <!-- 把表單改成vee-form -->
  <!-- 註冊完規則後要套用規則  -->
  <div
    class="text-white text-center font-bold p-4 rounded mb-4"
    v-if="reg_show_alert"
    :class="reg_alert_variant"
  >
    {{ reg_alert_msg }}
  </div>
  <vee-form
    :validation-schema="schema"
    @submit="register"
    :initial-values="userData"
  >
    <!-- Name -->
    <div class="mb-3">
      <label class="inline-block mb-2">姓名</label>
      <!-- 要驗證的input改成 vee-field -->

      <vee-field
        name="name"
        type="text"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="姓名"
      />
      <ErrorMessage class="text-red-600" name="name"></ErrorMessage>
    </div>
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">信箱</label>
      <vee-field
        name="email"
        type="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="信箱"
      />
      <ErrorMessage class="text-red-600" name="email"></ErrorMessage>
    </div>

    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">密碼</label>
      <!-- bails 一個一個檢查規則 -->
      <vee-field name="password" :bails="false" v-slot="{ field, errors }">
        <input
          type="password"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          placeholder="密碼"
          v-bind="field"
        />
        <div class="text-red-600" v-for="error in errors" :key="error">
          {{ error }}
        </div>
      </vee-field>
    </div>
    <!-- Confirm Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">再次輸入密碼</label>
      <vee-field
        name="confirm_password"
        type="password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="再次輸入密碼"
      />
      <ErrorMessage class="text-red-600" name="confirm_password"></ErrorMessage>
    </div>

    <!-- TOS -->
    <div class="mb-3 pl-6">
      <vee-field
        name="tos"
        value="1"
        type="checkbox"
        class="w-4 h-4 float-left -ml-6 mt-1 rounded"
      />
      <label class="inline-block">接受服務條款</label>
      <ErrorMessage class="text-red-600 block" name="tos"></ErrorMessage>
    </div>
    <button
      type="submit"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
      :disabled="reg_in_sub"
    >
      註冊
    </button>
  </vee-form>
</template>

<script>
import { mapActions } from "pinia";
import useUserStore from "@/stores/user";

export default {
  name: "registerFrom",
  data() {
    return {
      tab: "login",
      // 創造一個拿來存規則的值
      schema: {
        name: "required|min:1|max:100",
        email: "required|min:3|max:100|email",
        password: "required|min:8|max:16|excluded:password",
        confirm_password: "passwords_mismatch:@password",
        tos: "tos",
      },

      reg_in_sub: false,
      reg_show_alert: false,
      reg_alert_variant: "bg-blue-500",
      reg_alert_msg: "註冊中",
    };
  },
  // 註冊pinia裡的Action
  methods: {
    ...mapActions(useUserStore, { createUser: "register" }),

    async register(values) {
      this.reg_in_sub = true;
      this.reg_show_alert = true;
      this.reg_alert_variant = "bg-blue-500";
      this.reg_alert_msg = "註冊中";

      // 請求身分註冊
      try {
        // 使用註冊完的Action並且把values傳進去
        await this.createUser(values);
      } catch (err) {
        console.log(err);
        this.reg_in_sub = false;
        this.reg_alert_variant = "bg-red-500";
        this.reg_alert_msg = "請重新嘗試";
        return;
      }

      this.reg_alert_variant = "bg-green-500";
      this.reg_alert_msg = "註冊成功!請返回登入";
      window.location.reload();
    },
  },
};
</script>
