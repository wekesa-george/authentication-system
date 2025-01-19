// src/lib/authenticateUser.js
import type { RequestEvent } from "@sveltejs/kit";
import axios from "axios";
import { config } from "./config";

export const authenticateUser = async (event: RequestEvent) => {
  const url = `${config.AUTH_API}/auth/me`; 
 
  // Get the access and refresh tokens from cookies
  
  let accessToken =  event.cookies.get("slat");
  let refreshToken = event.cookies.get("slrt");

  const sendGetRequest = async () => {
    try {
      // Attempt to call /auth/me with the current access token
      let resp = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Proceed if the request is successful
      return resp.data
    } catch (error) {
      // Check if the error is due to an expired access token
      if (error.response && error.response.status === 403) {
        // Attempt to refresh the access token
        try {
          const tokenResp = await axios.post(
            `${config.AUTH_API}/auth/switch-token-new`,
            {
              refreshToken: refreshToken,
              tenantId: event.locals.tenancy.tenantId,
            }
          );

          if (tokenResp.status === 200) {
            // Set new access and refresh tokens as cookies
            event.cookies.set("slat", tokenResp.data.accessToken, {
              secure: false,
              httpOnly: true,
              path: "/",
            });
            event.cookies.set("slrt", tokenResp.data.refreshToken, {
              secure: false,
              httpOnly: true,
              path: "/",
            });

            // Update the tokens in variables
            accessToken = tokenResp.data.accessToken;
            refreshToken = tokenResp.data.refreshToken;

            // Retry the /auth/me request with the new access token
            let resp = await axios.get(url, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });
        
			return resp.data
            
          } else {
            // Refresh token failed; return null
            return null;
          }
        } catch (tokenError) {
          // Handle errors during token refresh
         // console.error("Token refresh error:", tokenError);
          return null;
        }
      } else {
        // Handle other errors
        //console.error("Authentication error:", error);
        return null;
      }
    }
  };

  return sendGetRequest();
};
