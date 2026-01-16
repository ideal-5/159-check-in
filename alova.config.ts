import type { Config } from '@alova/wormhole'

export default <Config>{
  // 接口生成器配置（可以配置多个）
  generator: [
    {
      // 接口文档来源
      // 支持在线 OpenAPI / Swagger 地址 或 本地 json 文件
      // input: 'https://petstore3.swagger.io/api/v3/openapi.json',
      input: 'http://127.0.0.1:4523/export/openapi/5?version=3.0',

      // 接口文档平台类型（目前仅支持 swagger / openapi）
      platform: 'swagger',

      // 接口方法与类型定义的输出目录
      // ⚠️ 多个 generator 不能使用相同的输出路径
      output: 'src/api',

      // 接口响应数据的媒体类型（一般为 application/json）
      responseMediaType: 'application/json',

      // 请求体（POST / PUT 等）的媒体类型
      bodyMediaType: 'application/json',

      // OpenAPI 版本
      // 2 = Swagger 2.0
      // 3 = OpenAPI 3.x
      // auto = 自动识别（默认）
      version: 3,

      // 生成代码的类型
      // 可选值：auto / ts / typescript / module / commonjs
      type: 'typescript',

      // 生成的全局 API 对象名称
      // 通过该对象可以访问所有生成的接口方法
      // ⚠️ 多个 generator 时必须配置，且名称不能重复
      global: 'Apis',

      // 接口生成前的处理函数
      // 可在此过滤、修改、增强接口定义
      handleApi: (apiDescriptor) => {
        // 如果接口被标记为废弃，则不生成
        if (apiDescriptor.deprecated) {
          return undefined
        }

        // 返回处理后的接口描述对象
        return apiDescriptor
      },
    },
  ],

  // 自动更新接口配置（仅对 VSCode 插件生效）
  autoUpdate: {
    // 打开编辑器时自动检查接口更新
    launchEditor: true,

    // 每隔 5 分钟检查一次接口是否发生变化
    interval: 5 * 60 * 1000,
  },
}
