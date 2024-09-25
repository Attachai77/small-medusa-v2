import type {
  AuthContext,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/medusa";
import type ConfigDataModuleService from "../../../modules/config-data/service";
import { CONFIG_DATA_MODULE } from "../../../modules/config-data";

interface MedusaRequestWithAuth extends MedusaRequest {
  auth_context: AuthContext;
}

export const POST = async (
  req: MedusaRequestWithAuth,
  res: MedusaResponse
) => {
  try {
    const { actor_id } = req.auth_context;
    const body = req.body;
    const configDataModuleService: ConfigDataModuleService =
      req.scope.resolve(CONFIG_DATA_MODULE);
    const resp = await configDataModuleService.saveRunningNumberConfig(
      body,
      actor_id
    );

    res.json({
      resp,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const GET = async (
  req: MedusaRequest<AuthContext>,
  res: MedusaResponse
) => {
  try {
    const configDataModuleService: ConfigDataModuleService = req.scope.resolve(CONFIG_DATA_MODULE);
    const paths = req.query.paths as string[]
    const data = await configDataModuleService.getByPaths(paths);

    res.json({
      data,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
