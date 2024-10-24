import { mainColor } from "../../../shared/utils/objects/colorMaps";
import { IconMap } from "../../../shared/utils/types/commonTypes";
import classes from "./LeftSideBar.module.scss";

type IconNames = "leave" | "resign" | "draw";

export const leftSideBarIcons: IconMap<IconNames> = {
  leave: () => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={classes["list-icon"]}>
      <g>
        <path
          d="M12 15L15 12M15 12L12 9M15 12H4M4 7.24802V7.2002C4 6.08009 4 5.51962 4.21799 5.0918C4.40973 4.71547 4.71547 4.40973 5.0918 4.21799C5.51962 4 6.08009 4 7.2002 4H16.8002C17.9203 4 18.4796 4 18.9074 4.21799C19.2837 4.40973 19.5905 4.71547 19.7822 5.0918C20 5.5192 20 6.07899 20 7.19691V16.8036C20 17.9215 20 18.4805 19.7822 18.9079C19.5905 19.2842 19.2837 19.5905 18.9074 19.7822C18.48 20 17.921 20 16.8031 20H7.19691C6.07899 20 5.5192 20 5.0918 19.7822C4.71547 19.5905 4.40973 19.2839 4.21799 18.9076C4 18.4798 4 17.9201 4 16.8V16.75"
          stroke={mainColor.c5}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  ),

  resign: () => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={classes["list-icon"]}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.5 1.75C6.5 1.33579 6.16421 1 5.75 1C5.33579 1 5 1.33579 5 1.75V21.75C5 22.1642 5.33579 22.5 5.75 22.5C6.16421 22.5 6.5 22.1642 6.5 21.75V13.6V3.6V1.75Z"
        fill={mainColor.c5}
      />
      <path
        d="M13.3486 3.78947L13.1449 3.70801C11.5821 3.08288 9.8712 2.9258 8.22067 3.25591L6.5 3.60004V13.6L8.22067 13.2559C9.8712 12.9258 11.5821 13.0829 13.1449 13.708C14.8385 14.3854 16.7024 14.5119 18.472 14.0695L18.6864 14.0159C19.3115 13.8597 19.75 13.298 19.75 12.6538V5.28673C19.75 4.50617 19.0165 3.93343 18.2592 4.12274C16.628 4.53055 14.9097 4.41393 13.3486 3.78947Z"
        fill={mainColor.c5}
      />
    </svg>
  ),

  draw: () => (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 32 32"
      xmlSpace="preserve"
      className={classes["list-icon"]}
    >
      <path
        fill={mainColor.c5}
        d="M30.753,8.801c-0.062-0.063-0.137-0.116-0.187-0.116c-0.008,0-0.016,0.001-0.022,0.004 c-0.039-0.152-0.103-0.268-0.196-0.356c-0.35-0.33-0.698-0.665-1.045-0.999c-0.457-0.439-0.913-0.878-1.377-1.309 c-0.658-0.611-1.287-1.276-1.897-1.919c-0.273-0.288-0.545-0.575-0.82-0.859c-0.151-0.157-0.36-0.243-0.586-0.243 c-0.123,0-0.249,0.034-0.359,0.086l-0.1-0.016c-0.225,0-0.438,0.086-0.601,0.243c-0.501,0.479-0.996,0.958-1.479,1.451l-0.102,0.106 c-0.141,0.146-0.281,0.293-0.479,0.464c-0.072,0.062-0.144,0.124-0.171,0.165c-0.263,0.074-0.461,0.271-0.557,0.555 c-0.041,0.122-0.043,0.294-0.004,0.437c0.043,0.156,0.126,0.257,0.234,0.388c0.009,0.011,0.017,0.021,0.028,0.032l-0.691,0.747 c-0.13,0.139-0.267,0.273-0.407,0.39c-0.107,0.075-0.216,0.137-0.33,0.189c-0.071,0.027-0.143,0.051-0.202,0.065 c-0.061,0.004-0.121,0.007-0.252,0.007c-0.001,0-0.002,0-0.003,0c-0.099-0.02-0.197-0.046-0.295-0.072 c-0.126-0.034-0.252-0.068-0.379-0.09c-0.239-0.041-0.469-0.071-0.7-0.071c-0.147,0-0.295,0.012-0.445,0.04 c-0.084,0.015-0.168,0.043-0.306,0.089c-0.2,0.068-0.407,0.146-0.599,0.241c-0.289,0.143-0.533,0.328-0.753,0.507l-0.237,0.257 c-0.062-0.022-0.144-0.047-0.275-0.047c-0.005,0-0.009,0-0.014,0c-0.138,0.012-0.276,0.017-0.415,0.017 c-0.459,0-0.928-0.057-1.409-0.115c-0.169-0.032-0.331-0.083-0.484-0.14c-0.175-0.086-0.335-0.192-0.487-0.303 c-0.174-0.144-0.337-0.3-0.521-0.48l0.167-0.156c0.088-0.079,0.151-0.184,0.185-0.286l0.088-0.062c0.146-0.147,0.23-0.35,0.23-0.557 c0-0.26-0.128-0.49-0.361-0.659c-0.089-0.078-0.171-0.168-0.251-0.257l-0.083-0.091c-0.231-0.251-0.472-0.487-0.723-0.717 c-0.32-0.297-0.617-0.616-0.915-0.934C9.955,4.203,9.741,3.974,9.52,3.753C9.366,3.6,9.159,3.515,8.937,3.515 c-0.037,0-0.155,0.006-0.171,0.005c-0.07-0.019-0.14-0.029-0.208-0.029c-0.198,0-0.387,0.077-0.562,0.229 c-0.205,0.176-0.4,0.363-0.594,0.551C7.249,4.419,7.095,4.567,6.936,4.71c-0.292,0.262-0.58,0.53-0.868,0.797L5.424,6.101 l-1.16,1.054L3.038,8.277L2.766,8.54c-0.14,0.137-0.28,0.274-0.427,0.406L2.13,9.134C1.902,9.339,1.674,9.544,1.475,9.736 C1.379,9.78,1.301,9.832,1.237,9.895C1.087,10.046,1,10.255,1,10.466c0,0.254,0.117,0.429,0.231,0.566 c0.408,0.495,0.889,0.984,1.471,1.494c0.119,0.106,0.243,0.209,0.366,0.312c0.316,0.265,0.643,0.539,0.907,0.855 c0.069,0.083,0.172,0.146,0.278,0.171c0.155,0.14,0.349,0.216,0.546,0.216c0.206,0,0.39-0.075,0.579-0.237l0.131-0.118 c0.144,0.221,0.286,0.444,0.411,0.675c0.192,0.354,0.356,0.726,0.516,1.094c0.169,0.408,0.274,0.746,0.33,1.056 c0.046,0.402,0.052,0.763,0.021,1.096c-0.013,0.07-0.081,0.351-0.081,0.351c-0.025,0.118-0.021,0.243,0.029,0.299l-0.409,0.555 l0.017,0.013l-0.014,0.004l-0.011-0.007l0.008,0.008l-0.012,0.003l-0.007,0.002c-0.147,0.187-0.292,0.374-0.408,0.582 c-0.093,0.166-0.159,0.35-0.223,0.529c-0.082,0.23-0.12,0.444-0.115,0.654c0.008,0.26,0.074,0.908,0.527,1.289 c0.219,0.187,0.453,0.295,0.735,0.341c0.192,0.031,0.389,0.057,0.586,0.064c0.006,0.058,0.058,0.482,0.078,0.62 c0.03,0.21,0.119,0.398,0.197,0.565c0.12,0.252,0.328,0.483,0.556,0.618c0.24,0.143,0.516,0.212,0.842,0.212 c0.091,0,0.182-0.005,0.273-0.014c-0.011,0.315,0.05,0.627,0.1,0.843c0.129,0.557,0.453,1.011,0.891,1.246 c0.229,0.122,0.491,0.182,0.799,0.182c0.12,0,0.24-0.009,0.36-0.023l0.04,0.362c0.034,0.336,0.069,0.682,0.265,0.988 c0.204,0.315,0.638,0.865,1.26,1.016c0.127,0.031,0.26,0.045,0.418,0.045c0.091,0,0.182-0.005,0.277-0.01 c0.37-0.024,0.679-0.081,0.974-0.177c0.423-0.139,0.842-0.355,1.312-0.677c0.177,0.152,0.378,0.241,0.602,0.331 c0.149,0.06,0.305,0.12,0.462,0.157c0.293,0.07,0.626,0.108,0.961,0.11c0.331,0,0.687-0.009,1.055-0.07 c0.169-0.028,0.354-0.102,0.567-0.229c0.074-0.045,0.211-0.138,0.315-0.26c0.221-0.258,0.336-0.531,0.419-0.765 c0.062-0.176,0.104-0.374,0.121-0.578c0.049,0.003,0.106,0.006,0.175,0.008c0.145,0,0.293-0.023,0.438-0.046l0.14-0.021 c0.341-0.051,0.765-0.154,1.036-0.487c0.178-0.222,0.299-0.461,0.369-0.732c0.074-0.297,0.103-0.589,0.088-0.868l-0.004-0.056 c0.172-0.024,0.35-0.074,0.541-0.15c0.203-0.08,0.431-0.181,0.59-0.388c0.095-0.122,0.173-0.227,0.239-0.366 c0.097-0.202,0.187-0.414,0.255-0.63c0.073-0.238,0.067-0.479,0.05-0.704c-0.004-0.054-0.008-0.108-0.014-0.162 c0.149-0.015,0.298-0.036,0.44-0.062c0.449-0.08,0.827-0.33,1.093-0.725c0.199-0.294,0.31-0.639,0.332-1.025 c0.01-0.162-0.02-0.34-0.055-0.542c-0.018-0.118-0.049-0.233-0.087-0.347c-0.141-0.414-0.4-0.799-0.634-1.12 c-0.177-0.246-0.371-0.479-0.564-0.711L24.3,16.859c0.126-0.151,0.197-0.327,0.204-0.523c0.024-0.113,0.061-0.223,0.099-0.332 l0.097-0.309c0.03-0.1,0.059-0.2,0.124-0.378c0.058-0.161,0.116-0.325,0.178-0.479c0.167-0.358,0.382-0.717,0.675-1.128 c0.258-0.324,0.536-0.627,0.817-0.931l0.048-0.051c0.057,0.058,0.114,0.121,0.175,0.199l0.058,0.081 c0.153,0.153,0.366,0.242,0.58,0.242c0.234,0,0.438-0.094,0.607-0.28l0.002,0.001c0.268-0.315,0.556-0.613,0.843-0.91 c0.152-0.158,0.305-0.315,0.454-0.475c0.177-0.19,0.359-0.374,0.542-0.558c0.326-0.328,0.663-0.667,0.957-1.036 c0.145-0.18,0.24-0.35,0.24-0.59C31,9.175,30.91,8.957,30.753,8.801z M6.301,10.94c-0.311,0.265-0.627,0.524-0.942,0.784 l-0.694,0.532c-0.369-0.295-0.736-0.63-1.124-1.023c-0.216-0.218-0.418-0.445-0.615-0.677l0.446-0.438 c0.105-0.104,0.206-0.21,0.308-0.316c0.129-0.135,0.257-0.269,0.392-0.398c0.335-0.322,0.677-0.635,1.02-0.949 c0,0,1.835-1.669,2.101-1.915c0.356-0.327,0.72-0.645,1.084-0.961l0.4-0.354c0,0,1.087,1.018,1.412,1.327 c0.189,0.182,0.377,0.363,0.558,0.552c-0.134,0.143-0.275,0.282-0.416,0.417c-0.195,0.187-0.4,0.364-0.605,0.54L8.981,8.623 C8.64,8.923,8.299,9.222,7.952,9.514c-0.318,0.269-0.632,0.542-0.945,0.815L6.301,10.94z M7.776,20.64 c-0.071,0.023-0.143,0.042-0.275,0.058c-0.096,0-0.192-0.006-0.279-0.006c-0.014,0-0.027,0-0.04,0l-0.003-0.114 c0.019-0.085,0.045-0.169,0.07-0.242c0.107-0.22,0.238-0.428,0.377-0.628c0.171-0.246,0.353-0.486,0.535-0.725l0.169-0.224 c0.417-0.528,0.804-0.933,1.211-1.268c0.1-0.07,0.205-0.136,0.302-0.187c0.15-0.052,0.306-0.095,0.451-0.123l0.152-0.005 c0.065,0,0.13,0.003,0.188,0.008c0.076,0.013,0.151,0.029,0.206,0.044c0.134,0.075,0.263,0.16,0.389,0.248 c-0.013,0.023-0.095,0.178-0.095,0.178c-0.08,0.13-0.174,0.253-0.268,0.374c-0.097,0.121-0.208,0.232-0.319,0.342l-0.438,0.446 c-0.431,0.428-0.866,0.82-1.292,1.163C8.518,20.204,8.159,20.457,7.776,20.64z M9.916,22.613c-0.172,0.068-0.345,0.129-0.516,0.163 c-0.068,0.006-0.137,0.01-0.276,0.038c-0.026-0.043-0.05-0.086-0.065-0.111c-0.021-0.081-0.037-0.162-0.049-0.24 c-0.009-0.078-0.016-0.157-0.035-0.178c0.102-0.155,0.144-0.343,0.121-0.537c0.211-0.142,0.416-0.293,0.613-0.449 c0.53-0.417,1.019-0.889,1.474-1.336c0.271-0.267,0.533-0.544,0.795-0.821c0.027-0.028,0.051-0.059,0.038-0.1l0.52-0.014 c0.065,0.015,0.129,0.032,0.178,0.048c0.038,0.02,0.076,0.041,0.118,0.072c0.061,0.093,0.114,0.192,0.18,0.342 c0.002,0.08-0.001,0.16-0.013,0.253c-0.03,0.067-0.062,0.134-0.096,0.2c-0.034,0.066-0.077,0.128-0.122,0.186 c-0.256,0.325-0.546,0.623-0.834,0.92l-0.158,0.163c-0.309,0.32-0.645,0.627-0.993,0.908C10.546,22.299,10.257,22.46,9.916,22.613z M12.071,24.904c-0.152,0.052-0.312,0.079-0.468,0.102c-0.105,0.012-0.211,0.02-0.317,0.02l-0.18-0.039l-0.044-0.077 c-0.038-0.114-0.068-0.228-0.094-0.327c-0.004-0.084-0.004-0.167-0.007-0.227c0.012-0.05,0.027-0.098,0.037-0.134l-0.016-0.041 l0.022,0.016c0.01-0.014,0.02-0.028,0.031-0.042l-0.074-0.031l-0.008-0.022l0.082,0.052c0.106-0.149,0.175-0.292,0.178-0.462 l0.092-0.044c0.258-0.149,0.487-0.345,0.709-0.535l0.126-0.107c0.26-0.222,0.509-0.454,0.75-0.695 c0.327-0.324,0.654-0.649,0.859-0.967c0.061,0.01,0.123,0.018,0.184,0.018c0.057,0,0.109-0.006,0.147-0.017l0.323-0.05 c0.061-0.007,0.12-0.012,0.166-0.014c0.042,0.009,0.083,0.021,0.109,0.028c0.072,0.037,0.141,0.078,0.195,0.113 c0.035,0.033,0.069,0.066,0.082,0.066c0,0,0.001,0,0.001,0c0.018,0.065,0.032,0.13,0.041,0.19c0.005,0.053,0.008,0.105,0.01,0.137 c-0.016,0.065-0.034,0.128-0.052,0.181c-0.138,0.28-0.31,0.522-0.459,0.72l-0.583,0.743c-0.196,0.246-0.438,0.478-0.763,0.73 C12.808,24.45,12.457,24.721,12.071,24.904z M16.981,24.778c-0.146,0.307-0.301,0.569-0.471,0.798 c-0.391,0.486-0.746,0.851-1.113,1.147c-0.281,0.205-0.526,0.355-0.764,0.468c-0.178,0.069-0.362,0.123-0.541,0.157 c-0.109,0.011-0.22,0.017-0.331,0.017c-0.056,0-0.111-0.002-0.226-0.028c-0.071-0.064-0.135-0.133-0.192-0.2 c-0.032-0.045-0.063-0.09-0.08-0.114c-0.013-0.049-0.022-0.099-0.029-0.147c-0.023-0.18-0.044-0.368-0.046-0.522 c0.032-0.098,0.043-0.205,0.033-0.326l0.059-0.032c0.102-0.055,0.204-0.111,0.297-0.182l0.105-0.08 c0.494-0.375,1.006-0.763,1.404-1.267c0,0,0.549-0.696,0.726-0.925c0.042,0.012,0.092,0.021,0.157,0.021 c0.003,0,0.257-0.026,0.257-0.026c0.209-0.023,0.419-0.046,0.628-0.046h0.106c0.04,0.02,0.08,0.041,0.1,0.041 c0.008,0,0.013-0.002,0.015-0.009c0.027,0.085,0.045,0.172,0.058,0.251c0.012,0.138,0.011,0.272,0.003,0.401 C17.1,24.382,17.05,24.589,16.981,24.778z M24.533,19.906c0.032,0.101,0.059,0.203,0.078,0.297c0.006,0.069,0.008,0.153-0.034,0.21 c-0.05,0.067-0.12,0.086-0.201,0.094c-0.114,0.011-0.228,0.019-0.341,0.019c-0.206,0-0.406-0.068-0.611-0.068 c-0.264,0-0.48,0.086-0.644,0.255c-0.175,0.181-0.267,0.405-0.267,0.648c0,0.187,0.055,0.312,0.135,0.493l0.086,0.183 c0.032,0.083,0.06,0.165,0.077,0.241c0.01,0.107,0.012,0.216,0.008,0.306c-0.032,0.135-0.045,0.33-0.185,0.394 c-0.126,0.058-0.275-0.009-0.395-0.052c-0.001,0-0.146-0.052-0.146-0.052c-0.082-0.028-0.17-0.042-0.261-0.042 c-0.153,0-0.308,0.041-0.435,0.115c-0.308,0.18-0.448,0.521-0.374,0.911c0.018,0.102,0.066,0.196,0.149,0.365 c0.046,0.114,0.085,0.231,0.112,0.339c0.013,0.139,0.006,0.275,0,0.415c-0.002,0.045-0.004,0.09-0.018,0.132 c-0.034,0.107-0.138,0.179-0.247,0.206c-0.193,0.049-0.457,0.002-0.653-0.026c-0.12-0.017-0.241-0.035-0.361-0.076 c-0.067-0.033-0.133-0.065-0.205-0.093c-0.062-0.026-0.131-0.039-0.205-0.039c-0.16,0-0.316,0.061-0.42,0.107 c-0.2,0.09-0.339,0.311-0.388,0.491c-0.108,0.394,0.215,0.724,0.145,1.11c-0.065,0.358-0.496,0.293-0.764,0.293 c-0.133,0-0.266-0.005-0.39-0.015c-0.133-0.021-0.264-0.049-0.38-0.089c0.075-0.12,0.172-0.228,0.263-0.342 c0.215-0.27,0.388-0.503,0.529-0.763c0.18-0.332,0.315-0.657,0.401-0.967c0.114-0.42,0.158-0.781,0.132-1.104 c-0.016-0.205-0.04-0.445-0.106-0.674c-0.052-0.181-0.178-0.515-0.438-0.717c-0.122-0.096-0.239-0.184-0.373-0.259 c-0.102-0.058-0.211-0.102-0.382-0.171c-0.113-0.045-0.232-0.053-0.43-0.068c-0.124-0.012-0.249-0.017-0.375-0.017l-0.037,0.002 c0.01-0.18-0.014-0.358-0.043-0.562l-0.02-0.138c-0.008-0.051-0.019-0.102-0.036-0.162c-0.035-0.09-0.072-0.181-0.118-0.283 c-0.091-0.14-0.202-0.272-0.351-0.414c-0.264-0.249-0.602-0.446-0.927-0.538c-0.15-0.043-0.306-0.068-0.486-0.079 c0.02-0.301-0.007-0.54-0.085-0.749c-0.142-0.379-0.332-0.691-0.566-0.928c-0.123-0.125-0.292-0.241-0.516-0.353 c-0.149-0.075-0.309-0.135-0.512-0.195c0.012-0.115,0.001-0.215-0.031-0.268c0.028-0.132,0.025-0.271-0.011-0.401 c-0.055-0.199-0.172-0.353-0.38-0.497c-0.255-0.18-0.514-0.351-0.786-0.505c-0.327-0.185-0.716-0.275-1.237-0.275 c-0.638,0.008-1.274,0.211-1.746,0.555c-0.149,0.109-0.288,0.229-0.422,0.353c-0.035-0.4-0.102-0.758-0.202-1.091 c-0.072-0.239-0.164-0.471-0.288-0.782c-0.124-0.308-0.25-0.617-0.391-0.918c-0.18-0.383-0.392-0.754-0.607-1.12 c0,0,0.179-0.163,0.244-0.218c0.448-0.374,0.883-0.763,1.317-1.152l0.286-0.255c0.192-0.169,0.389-0.331,0.587-0.492l0.214-0.176 c0.225-0.185,0.443-0.38,0.662-0.575l0.417-0.373c0.303,0.274,0.637,0.541,0.994,0.795c0.379,0.267,0.825,0.461,1.289,0.559 c0.216,0.046,0.441,0.067,0.664,0.087l0.32,0.03c-0.058,0.069-0.381,0.461-0.381,0.461c-0.373,0.431-0.693,0.833-0.979,1.229 c-0.254,0.352-0.432,0.75-0.517,1.151c-0.054,0.257-0.084,0.522-0.102,0.784c-0.018,0.245,0.009,0.498,0.076,0.713 c0.079,0.253,0.207,0.478,0.403,0.708c0.233,0.276,0.624,0.454,0.91,0.554c0.235,0.082,0.481,0.122,0.751,0.122 c0.28,0,0.58-0.043,0.943-0.134c0.249-0.062,0.49-0.17,0.698-0.266c0.215-0.101,0.399-0.259,0.576-0.411l0.079-0.067 c0.189-0.161,0.368-0.332,0.547-0.503c0.171-0.163,0.342-0.327,0.521-0.481c0.19-0.163,0.376-0.335,0.563-0.505l0.382-0.345 c0.353,0.222,0.698,0.453,1.029,0.703l0.384,0.308c0.259,0.208,0.518,0.416,0.78,0.619c0.437,0.337,0.821,0.662,1.177,0.994 c0.385,0.359,0.76,0.714,1.109,1.102c0.105,0.116,0.202,0.237,0.3,0.357l0.165,0.203c0.162,0.191,0.318,0.385,0.471,0.58 C24,19.051,24.313,19.465,24.533,19.906z M24.68,12.457c-0.485,0.623-0.984,1.297-1.271,2.08l-0.083,0.221 c-0.052,0.138-0.105,0.275-0.151,0.415c-0.031,0.095-0.116,0.385-0.116,0.385c-0.083-0.082-0.167-0.164-0.255-0.243 c-0.514-0.455-1.067-0.881-1.542-1.243c-0.313-0.25-0.614-0.514-0.915-0.778c-0.425-0.369-0.868-0.704-1.318-0.996 c-0.095-0.061-0.261-0.129-0.374-0.138c-0.115-0.009-0.2-0.071-0.309-0.1c-0.074-0.02-0.148-0.03-0.222-0.03 c-0.073,0-0.147,0.01-0.221,0.031c-0.294,0.081-0.594,0.397-0.82,0.596c-0.256,0.226-0.499,0.465-0.749,0.697l-0.302,0.28 c-0.142,0.13-0.284,0.26-0.421,0.394c-0.181,0.175-0.372,0.344-0.563,0.499c-0.095,0.069-0.191,0.132-0.287,0.179 c-0.185,0.068-0.38,0.113-0.567,0.145c-0.051,0.004-0.103,0.007-0.213,0.007c-0.011,0-0.022,0-0.034,0 c-0.075-0.016-0.147-0.037-0.205-0.055c-0.065-0.034-0.127-0.073-0.212-0.189c-0.004-0.102,0-0.205,0.009-0.301 c0.029-0.181,0.067-0.364,0.125-0.528c0.168-0.353,0.403-0.673,0.648-0.996l0.775-0.957c0.275-0.345,0.601-0.691,0.972-1.028 c0.269-0.245,0.548-0.484,0.829-0.709c0.134-0.098,0.275-0.184,0.421-0.251c0.138-0.055,0.276-0.107,0.487-0.138 c0.081,0,0.163,0.005,0.235,0.01c0.19,0.037,0.374,0.088,0.645,0.164c0.181,0.05,0.39,0.077,0.682,0.077 c0.395-0.005,0.847-0.136,1.24-0.358c0.275-0.154,0.526-0.361,0.769-0.632c0.238-0.263,0.491-0.508,0.745-0.753l0.068-0.066 l0.036,0.03c0.471,0.542,0.962,1.065,1.465,1.58c0.241,0.248,0.473,0.503,0.706,0.759c0.212,0.232,0.424,0.465,0.642,0.692 c0.086,0.091,0.375,0.376,0.375,0.376C25.156,11.866,24.918,12.152,24.68,12.457z M28.104,10.471 c-0.222,0.246-0.457,0.482-0.691,0.717l-0.09,0.091l-0.616-0.634c-0.44-0.452-0.878-0.907-1.315-1.363l-0.664-0.687 c-0.28-0.29-0.562-0.579-0.837-0.873c-0.249-0.266-0.494-0.535-0.73-0.81c-0.129-0.15-0.261-0.297-0.394-0.444l-0.065-0.072 c0.123-0.131,0.258-0.254,0.392-0.375l0.124-0.113c0.25-0.231,0.505-0.459,0.76-0.687l0.457-0.41c0.354,0.345,0.71,0.69,1.077,1.023 c0.243,0.218,0.471,0.45,0.698,0.682c0.191,0.195,0.382,0.389,0.581,0.575c0.409,0.384,0.818,0.769,1.216,1.164l0.484,0.471 c0.207,0.2,0.414,0.4,0.616,0.604C28.779,9.715,28.445,10.096,28.104,10.471z"
      />
    </svg>
  ),
};
