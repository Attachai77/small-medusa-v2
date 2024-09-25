import { MedusaService } from "@medusajs/utils";
import { ConfigDataModel } from "./models/config-data";

enum RunningNumberMainPath {
  order = "order",
}

interface RunningNumberCreate {
  // @ts-ignore
  [RunningNumberMainPath]: Record<
    string,
    {
      path: string;
      value: string;
    }
  >;
}

export default // @ts-ignore
class ConfigDataModuleService extends MedusaService({
  ConfigDataModel,
}) {
  constructor() {
    super(...arguments);
  }

  async saveRunningNumberConfig(data: RunningNumberCreate, actorId: string) {
    const savedConfigData = [];

    for (const section of Object.keys(data)) {
      for (const field of Object.keys(data[section])) {
        const configData = {
          path: data[section][field].path,
          value: data[section][field].value,
          created_by: undefined,
        };
        const existingConfigData = await this.getByPath(configData.path);
        if (existingConfigData) {
          existingConfigData.value = configData.value;
          existingConfigData.updated_by = actorId;

          const updated = await this.updateConfigDataModels(existingConfigData);
          savedConfigData.push(updated);
        } else {
          configData.created_by = actorId;

          const saved = await this.createConfigDataModels(configData);
          savedConfigData.push(saved);
        }
      }
    }

    return savedConfigData;
  }

  async getByPath(path: string) {
    return await this.listConfigDataModels({
      path,
    }).then((res) => {
      return res[0] || null;
    });
  }

  async getByPaths(paths: string[]) {
    const result = await this.listConfigDataModels({
      path: paths,
    });

    return result;
  }
}
