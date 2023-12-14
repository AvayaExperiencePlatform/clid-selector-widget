import axios from "axios";
import process from "../../app/config";
const widgetAPI = window.WS.widgetAPI();

export function listPhoneNumbers({ pageSize, pageNumber }) {
  const config = {
    method: "get",
    url: `${process.env.AXP_PROXY_BASE_URL}/api/admin/voice/v1/accounts/${process.env.AXP_ACCOUNT_ID}/phone-numbers`,
    params: { pageSize, pageNumber },
  };
  return axios(config).then((response) => {
    return response.data;
  });
}

export function startVoiceCall({ clid, target }) {
  return widgetAPI.startVoiceInteraction(target, clid);
}

export function startConsultCall({ interactionId, clid, target }) {
  return widgetAPI.consult(target, null, interactionId, clid);
}

export function startSingleStepTransferCall({ interactionId, clid, target }) {
  return widgetAPI.singleStepTransfer(target, interactionId, clid);
}

export function getCapabilities() {
  return widgetAPI.getCapabilities();
}

export function getAgentDetails() {
  return widgetAPI.getConfiguration()?.user;
}

export function subscribeToAgentState(callback) {
  widgetAPI.onDataEvent("onAgentStateEvent", callback);
}
