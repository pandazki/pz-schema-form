// 为基础的数据类型提供最简单的校验
const mixin = {
  data() {
    return {
      errorMsg: undefined
    };
  },
  methods: {
    async validate() {
      // 检查的时候收集错误信息
      try {
        await this.schemaValidate(this.val);
        this.errorMsg = undefined;
      } catch (error) {
        this.errorMsg = error.message;
        throw error;
      }
    }
  }
};
export default mixin;
