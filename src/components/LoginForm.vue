<template>
  <div
    class="text-white text-center font-bold p-4 rounded mb-4"
    v-if="login_show_alert"
    :class="login_alert_variant"
  >
    {{ login_alert_msg }}
  </div>
  <!-- Login Form -->
  <vee-form :validation-schema="loginSchema" @submit="login">
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">信箱</label>
      <vee-field
        name="email"
        type="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="信箱"
      />
      <ErrorMessage class="text-red-600" name="email" />
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">密碼</label>
      <vee-field
        name="password"
        type="password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="密碼"
      />
      <ErrorMessage class="text-red-600" name="password" />
    </div>
    <button
      type="submit"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
      :disabled="login_in_sub"
    >
      登入
    </button>
  </vee-form>
</template>

<script>
import { mapActions } from "pinia";
import useUserStore from "@/stores/user";

export default {
  name: "loginFrom",
  data() {
    return {
      loginSchema: {
        email: "required|email",
        password: "required|min:8|max:16",
      },
      login_in_sub: false,
      login_show_alert: false,
      login_alert_variant: "bg-blue-500",
      login_alert_msg: "登入中",
    };
  },
  methods: {
    ...mapActions(useUserStore, ["authenticate"]),

    async login(values) {
      this.login_in_sub = true;
      this.login_show_alert = true;
      this.login_alert_variant = "bg-blue-500";
      this.login_alert_msg = "登入中";

      try {
        // 調用user.js裡的authenticate 並且把登入表單的values傳入
        await this.authenticate(values);
      } catch (err) {
        this.login_in_sub = false;
        this.login_alert_variant = "bg-red-500";
        this.login_alert_msg = "請重新嘗試";
        return;
      }

      this.login_alert_variant = "bg-green-500";
      this.login_alert_msg = "登入成功!";
      window.location.reload();
    },
  },
};
</script>
