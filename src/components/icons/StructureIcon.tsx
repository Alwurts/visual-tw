import { HTMLAttributes } from "react";

const StructureIcon = (props: HTMLAttributes<HTMLOrSVGElement>) => (
  <svg
    fill="currentColor"
    viewBox="0 0 24 24"
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
      <path d="M12,7h8a1,1,0,0,0,1-1V2a1,1,0,0,0-1-1H12a1,1,0,0,0-1,1V3H5V2A1,1,0,0,0,3,2V20a1,1,0,0,0,1,1h7v1a1,1,0,0,0,1,1h8a1,1,0,0,0,1-1V18a1,1,0,0,0-1-1H12a1,1,0,0,0-1,1v1H5V13h6v1a1,1,0,0,0,1,1h8a1,1,0,0,0,1-1V10a1,1,0,0,0-1-1H12a1,1,0,0,0-1,1v1H5V5h6V6A1,1,0,0,0,12,7Zm1,12h6v2H13Zm0-8h6v2H13Zm0-8h6V5H13Z"></path>
    </g>
  </svg>
);

export default StructureIcon;
