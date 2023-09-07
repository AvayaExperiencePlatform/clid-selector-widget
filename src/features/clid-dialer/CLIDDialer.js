/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Container, Box, Typography, CssBaseline } from "@mui/material";
import { TextInput, Select, SelectOption, Button } from "@avaya/neo-react";
import {
  listPhoneNumbersThunk,
  startVoiceCallThunk,
  getAgentDetailsThunk,
  setCurrentAgentState,
  startConsultCallThunk,
  startSingleStepTransferCallThunk,
} from "./clidDialerSlice";
import { subscribeToAgentState } from "./clidDialerAPI";
import initAuth from "../../services/Auth";

const theme = createTheme({
  palette: {
    secondary: {
      main: "#e53935",
    },
  },
});


export function CLIDDialer(props) {
  const dispatch = useDispatch();
  const allCLIDs = useSelector(({ clidDialer }) => clidDialer.phoneNumbers);
  const agent = useSelector(({ clidDialer }) => clidDialer.agent);
  const agentState = useSelector(({ clidDialer }) => clidDialer.agentState);
  const [selectedCLID, setSelectedCLID] = useState(null);
  const [targetPhoneNumber, setTargetPhoneNumber] = useState("");

  useEffect(() => {
    /* eslint-disable-next-line no-unused-vars */
    initAuth({ dispatch }).then((response) => {
      dispatch(getAgentDetailsThunk());
      subscribeToAgentState((data) => {
        dispatch(setCurrentAgentState(data));
      });
    });
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (agent && agent.id) {
      dispatch(getAgentDetailsThunk());
      dispatch(listPhoneNumbersThunk());
    }
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agent]);

  const handleStartVoiceCall = () => {
    dispatch(
      startVoiceCallThunk({ clid: selectedCLID, target: targetPhoneNumber })
    );
  };

  // CONSULT
  const handleConsultCall = () => {
    dispatch(
      startConsultCallThunk({ interactionId: props.interactionId, clid: selectedCLID, target: targetPhoneNumber })
    );
  };

  // SINGLE STEP TRANSFER
  const handleSingleStepTransferCall = () => {
    dispatch(
      startSingleStepTransferCallThunk({
        interactionId: props.interactionId, clid: selectedCLID, target: targetPhoneNumber
      })
    )
  }

  return (
    agent &&
    allCLIDs && (
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth={false}>
          <CssBaseline />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              marginTop: 8,
            }}
          >
            <Typography
              component="div"
              variant="h6"
              sx={{ fontFamily: "noto-sans,sans-serif", marginBottom: "10px" }}
            >
              {"CLID Selector"}
            </Typography>
            <div
              style={{
                width: "70%",
                display: "grid",
                gridTemplateColumns: "1fr 0.1fr 1fr",
                backgroundColor: "rgb(241, 241, 241)",
                padding: "15px",
              }}
            >
              <Select
                label={"CLIDs"}
                aria-label={"CLIDs"}
                // defaultValue={}
                value={selectedCLID}
                id="select-q"
                placeholder="Select A CLID"
                onChange={(value) => {
                  setSelectedCLID(value);
                }}
                style={{
                  width: "100%",
                }}
              >
                {allCLIDs
                  .filter(
                    (clid) =>
                      !(
                        clid.displayName == "Proactive Outreach" ||
                        clid.phoneNumber.startsWith("+83")
                      )
                  )
                  .map((clid) => (
                    <SelectOption
                      key={clid.phoneNumberId}
                      style={{ width: "100%" }}
                      value={clid.phoneNumber}
                      helperText={clid.displayName}
                    >
                      {clid.phoneNumber}
                    </SelectOption>
                  ))}
                <SelectOption
                  key={"anon"}
                  style={{ width: "100%" }}
                  value={null}
                  helperText={"Anonymous"}
                >
                  Anonymous
                </SelectOption>
              </Select>
              <div />
              <TextInput
                label={"Target Phone Number"}
                aria-label={"tpn"}
                style={{
                  width: "100%",
                }}
                placeholder={"Enter a phone number"}
                type="number"
                required
                // error={!validProficiency(queue.proficiency)}
                clearable
                onChange={(event) => setTargetPhoneNumber(event.target.value)}
                value={targetPhoneNumber}
              />
            </div>
            <div style={{ display: "inline" }}>
              {!props.interactionId && <Button
                aria-label="Start Outbound Call"
                label="Start Outbound Call"
                disabled={
                  !selectedCLID ||
                  !targetPhoneNumber ||
                  !agentState?.resourceStates?.VOICE?.capabilities
                    ?.canStartInteraction
                }
                onClick={handleStartVoiceCall}
                id="start-ob-c"
                variant="secondary"
                style={{ marginTop: "10px" }}
              >
                Start Outbound Call
              </Button>}

              {props.interactionId &&
                < Button
                  aria-label="Start Consult"
                  label="Start Consult"
                  disabled={
                    !selectedCLID ||
                    !targetPhoneNumber ||
                    !props.interactionId
                  }
                  onClick={handleConsultCall}
                  id="start-c-c"
                  variant="secondary"
                  style={{ marginTop: "10px" }}
                >
                  Start Consult
                </Button>
              }
              {props.interactionId &&

                < Button
                  aria-label="Start Transfer"
                  label="Start Transfer"
                  disabled={
                    !selectedCLID ||
                    !targetPhoneNumber ||
                    !props.interactionId
                  }
                  onClick={handleSingleStepTransferCall}
                  id="start-t-c"
                  variant="secondary"
                  style={{ marginTop: "10px" }}
                >
                  Start Transfer
                </Button>
              }
            </div>
          </Box>
        </Container >
      </ThemeProvider >
    )
  );
}
