import { HTMLAttributes } from "react";

const CodeIcon = (props: HTMLAttributes<HTMLOrSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={props.className}
  >
    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M14.9523 6.2635L10.4523 18.2635L9.04784 17.7368L13.5478 5.73682L14.9523 6.2635ZM19.1894 12.0001L15.9698 8.78042L17.0304 7.71976L21.3108 12.0001L17.0304 16.2804L15.9698 15.2198L19.1894 12.0001ZM8.03032 15.2198L4.81065 12.0002L8.03032 8.78049L6.96966 7.71983L2.68933 12.0002L6.96966 16.2805L8.03032 15.2198Z"
      ></path>
    </g>
  </svg>
);

export default CodeIcon;
