import LogsPanel from "./LogsPanel-BnH3S-xQ.js";
import { d as defineComponent, a9 as useWorkflowsStore, x as computed, e as createBlock, f as createCommentVNode, g as openBlock } from "./index-DuT-FIl1.js";
import "./AnimatedSpinner-C6hUJocW.js";
import "./ConsumedTokensDetails.vue_vue_type_script_setup_true_lang-D-Jt6Gli.js";
import "./core-ChTWffJl.js";
import "./canvas-D0IR7_I9.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DemoFooter",
  setup(__props) {
    const workflowsStore = useWorkflowsStore();
    const hasExecutionData = computed(() => workflowsStore.workflowExecutionData);
    return (_ctx, _cache) => {
      return hasExecutionData.value ? (openBlock(), createBlock(LogsPanel, {
        key: 0,
        "is-read-only": true
      })) : createCommentVNode("", true);
    };
  }
});
export {
  _sfc_main as default
};
