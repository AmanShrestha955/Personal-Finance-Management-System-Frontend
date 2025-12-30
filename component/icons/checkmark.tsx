export default function CheckmarkIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      className={props.className}
    >
      <path
        d="M0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8Z"
        fill="#3C3B45"
      />
      <mask
        id="mask0_530_1255"
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="3"
        y="3"
        width="10"
        height="10"
      >
        <path
          d="M6.97925 10.5L4.60425 8.12498L5.198 7.53123L6.97925 9.31248L10.8022 5.48956L11.3959 6.08331L6.97925 10.5Z"
          fill="#E3E3E3"
        />
      </mask>
      <g mask="url(#mask0_530_1255)">
        <rect x="3" y="3" width="10.625" height="10" fill="#D9D9D9" />
      </g>
    </svg>
  );
}
