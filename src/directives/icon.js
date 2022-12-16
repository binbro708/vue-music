// icon v-指令
export default {
  // 先創建在註冊
  beforeMount(el, binding) {
    let iconClass = `fa fa-${binding.value} text-2xl`;

    if (binding.arg === "full") {
      iconClass = binding.value;
    }
    // 修飾符設定
    if (binding.modifiers.right) {
      iconClass += ` float-right`;
    }
    if (binding.modifiers.yellow) {
      iconClass += ` text-yellow-400`;
    } else {
      iconClass += ` text-green-400`;
    }

    el.innerHTML += ` <i class="${iconClass}"></i>`;
  },
};
