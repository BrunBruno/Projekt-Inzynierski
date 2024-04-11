type LogoIconSvgProps = {
  iconClass: string;
  defsIds: {
    id0: string;
    id1: string;
    id2: string;
    id3: string;
    id4: string;
    id5: string;
    id6: string;
  };
};

function LogoIconSvg({ iconClass, defsIds }: LogoIconSvgProps) {
  return (
    <svg
      viewBox="0 0 1000 1000"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={iconClass}
    >
      <path
        d="M0 50C0 22.3858 22.3858 0 50 0H450C477.614 0 500 22.3858 500 50V450C500 477.614 477.614 500 450 500H50C22.3858 500 0 477.614 0 450V50Z"
        // fill="url(#paint0_linear_0_1)"
        fill={`url(#${defsIds.id0})`}
      />
      <path
        d="M500 550C500 522.386 522.386 500 550 500H950C977.614 500 1000 522.386 1000 550V950C1000 977.614 977.614 1000 950 1000H550C522.386 1000 500 977.614 500 950V550Z"
        // fill="url(#paint1_linear_0_1)"
        fill={`url(#${defsIds.id1})`}
      />
      <rect
        x="500"
        width="500"
        height="500"
        rx="50"
        // fill="url(#paint2_linear_0_1)"
        fill={`url(#${defsIds.id2})`}
      />
      <rect
        y="500"
        width="500"
        height="500"
        rx="50"
        // fill="url(#paint3_linear_0_1)"
        fill={`url(#${defsIds.id3})`}
      />
      <path
        d="M367.76 58L369.76 58.5C378.093 63.5 385.26 69.1666 391.26 75.5C397.593 81.5 403.26 88 408.26 95C413.593 101.667 417.76 109 420.76 117C433.426 147.667 422.426 182 387.76 220C373.093 236 356.593 249.667 338.26 261C342.926 264.333 347.26 266.833 351.26 268.5C355.593 269.833 361.593 272.667 369.26 277C376.926 281 381.926 288.833 384.26 300.5C386.593 311.833 385.926 324.667 382.26 339C378.926 353.333 372.593 368.167 363.26 383.5C354.26 398.5 342.426 412 327.76 424C294.426 451.667 255.76 463.333 211.76 459C205.426 459 201.426 458.5 199.76 457.5C198.093 456.5 196.76 455.667 195.76 455C194.76 454.333 192.593 453.833 189.26 453.5C180.926 460.167 171.426 464.333 160.76 466C150.093 467.667 139.926 466.833 130.26 463.5C120.926 460.167 112.926 454.5 106.26 446.5C99.9264 438.5 96.7598 428 96.7598 415C97.7598 406.333 99.4264 399.5 101.76 394.5C100.76 391.5 100.26 387.833 100.26 383.5C111.593 323.167 122.26 277 132.26 245C152.593 181.333 174.593 133.333 198.26 101C217.593 73.6666 244.426 56 278.76 48C311.76 40.3333 341.426 43.6666 367.76 58ZM212.26 407C216.26 406 219.593 405.833 222.26 406.5C225.26 406.833 228.76 406.667 232.76 406C242.426 405 255.426 399 271.76 388C282.093 377.667 287.593 367.5 288.26 357.5C288.926 347.5 287.426 341.167 283.76 338.5C280.093 335.5 275.093 334 268.76 334C262.76 334 255.926 335 248.26 337C240.926 338.667 233.76 339.667 226.76 340V341C225.093 347.667 223.426 353.5 221.76 358.5C220.093 363.5 218.593 368.333 217.26 373C214.26 384 211.926 395.333 210.26 407H212.26ZM305.26 147C295.26 145.667 284.426 153.5 272.76 170.5C265.426 181.167 259.76 197.333 255.76 219C262.76 216 269.593 213.5 276.26 211.5C283.26 209.167 289.76 206.667 295.76 204C310.426 197.667 320.926 190 327.26 181C334.593 172.333 336.926 165 334.26 159C330.26 153.667 323.76 148.833 314.76 144.5C312.093 146.833 308.926 147.667 305.26 147ZM297.76 145H299.26H297.76Z"
        // fill="url(#paint4_linear_0_1)"
        fill={`url(#${defsIds.id4})`}
      />
      <path
        d="M691.992 436.5C688.992 449.833 678.659 458 660.992 461C644.659 464 629.159 462.167 614.492 455.5C598.159 448.5 590.992 438.667 592.992 426C590.992 406.667 601.159 364.667 623.492 300C656.826 203 690.159 133.667 723.492 92C732.159 81.3333 739.492 74.5 745.492 71.5C751.826 68.1666 758.992 65.1666 766.992 62.5C774.992 59.8333 783.326 57.3333 791.992 55C809.326 50.3333 825.659 47.1666 840.992 45.5C856.659 43.5 870.659 45.3333 882.992 51C895.326 56.3333 904.826 64.3333 911.492 75C918.492 85.6667 922.826 98.3333 924.492 113C926.159 127.333 925.659 142.5 922.992 158.5C920.326 174.167 915.492 190.167 908.492 206.5C901.492 222.5 892.659 237.5 881.992 251.5C858.659 282.167 831.326 302 799.992 311L804.992 319.5C809.326 326.167 814.492 333.5 820.492 341.5C826.826 349.5 832.992 357.667 838.992 366C845.326 374.333 850.992 382.667 855.992 391C860.992 399.333 864.659 407.167 866.992 414.5C872.326 430.833 868.159 442.667 854.492 450C843.492 456.667 834.826 458.333 828.492 455C825.826 453.333 823.159 451.167 820.492 448.5C817.826 446.167 814.159 444.167 809.492 442.5C789.826 448.167 774.826 443.167 764.492 427.5C758.159 417.5 753.326 408.333 749.992 400C746.659 391.667 743.826 384.667 741.492 379C735.492 366.667 728.659 356 720.992 347C717.326 356 713.159 367.5 708.492 381.5C702.826 399.167 696.492 417.5 689.492 436.5H691.992ZM792.992 145.5C786.659 159.833 782.326 169.833 779.992 175.5C775.326 186.833 770.159 199.333 764.492 213C763.492 220.333 762.659 225.5 761.992 228.5L768.992 221.5L777.492 217.5C783.492 214.167 788.992 211.167 793.992 208.5C798.992 205.833 803.492 202.5 807.492 198.5C815.159 190.833 821.826 178.333 827.492 161C827.492 157.667 827.992 154.333 828.992 151C830.326 147.667 831.159 144.333 831.492 141C832.826 133.667 829.826 128.5 822.492 125.5C815.826 124.833 807.492 130.333 797.492 142C795.492 144.333 793.992 145.5 792.992 145.5Z"
        // fill="url(#paint5_linear_0_1)"
        fill={`url(#${defsIds.id5})`}
      />
      <path
        d="M126.529 741C133.196 718.667 138.529 701.5 142.529 689.5C146.863 677.167 151.029 666.167 155.029 656.5C159.029 646.833 163.529 637.5 168.529 628.5C173.863 619.5 179.529 611.333 185.529 604C191.863 596.333 198.529 590.333 205.529 586C212.529 581.667 219.863 579.5 227.529 579.5C235.196 579.5 243.196 582.5 251.529 588.5C264.863 621.833 273.029 644.167 276.029 655.5C280.029 672.167 283.696 695.667 287.029 726C290.029 718.333 293.363 710.333 297.029 702C301.029 693.333 304.863 684.667 308.529 676C318.863 654 325.363 637.333 328.029 626C335.363 602.667 350.529 585.167 373.529 573.5C393.529 563.5 412.196 560.333 429.529 564C436.529 565.333 441.363 568.167 444.029 572.5C447.029 576.833 447.029 581.333 444.029 586C441.363 590.667 440.363 595.167 441.029 599.5C442.029 603.5 442.863 608.333 443.529 614C444.529 629.333 441.863 643 435.529 655C429.196 666.667 422.696 681.333 416.029 699C409.363 716.333 402.529 734.833 395.529 754.5C388.863 774.167 382.029 794.167 375.029 814.5C368.029 834.833 361.196 853.333 354.529 870C339.863 908.333 327.863 929.5 318.529 933.5C305.863 941.167 296.529 945.667 290.529 947C282.863 948.333 272.029 948.333 258.029 947C249.363 946.333 241.863 935.167 235.529 913.5C231.863 901.833 228.529 885.667 225.529 865C220.196 829 216.529 809.167 214.529 805.5C201.196 848.833 191.696 876.167 186.029 887.5C180.696 898.833 176.529 906.333 173.529 910C170.863 913.667 167.529 918.5 163.529 924.5C159.196 936.5 148.863 945.333 132.529 951C118.529 956.333 105.863 957.167 94.5293 953.5C82.196 949.5 78.5293 941.833 83.5293 930.5C87.196 890.5 101.529 827.333 126.529 741Z"
        // fill="url(#paint6_linear_0_1)"
        fill={`url(#${defsIds.id6})`}
      />
      <defs>
        <linearGradient
          id={defsIds.id0}
          x1="250"
          y1="0"
          x2="250"
          y2="500"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#E5DBFF" />
          <stop offset="1" stopColor="#898399" />
        </linearGradient>
        <linearGradient
          id={defsIds.id1}
          x1="750"
          y1="500"
          x2="750"
          y2="1000"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#E5DBFF" />
          <stop offset="1" stopColor="#898399" />
        </linearGradient>
        <linearGradient
          id={defsIds.id2}
          x1="750"
          y1="0"
          x2="750"
          y2="500"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6741D9" />
          <stop offset="1" stopColor="#372273" />
        </linearGradient>
        <linearGradient
          id={defsIds.id3}
          x1="250"
          y1="500"
          x2="250"
          y2="1000"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6741D9" />
          <stop offset="1" stopColor="#372273" />
        </linearGradient>
        <linearGradient
          id={defsIds.id4}
          x1="250"
          y1="-150"
          x2="250"
          y2="350"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.50235" stopColor="#5F3DC4" />
          <stop offset="1" stopColor="#2E1D5E" />
          <stop offset="1" stopColor="#2E1D5E" />
        </linearGradient>
        <linearGradient
          id={defsIds.id5}
          x1="750"
          y1="-150"
          x2="750"
          y2="350"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.497751" stopColor="#E5DBFF" />
          <stop offset="1" stopColor="#898399" />
        </linearGradient>
        <linearGradient
          id={defsIds.id6}
          x1="250"
          y1="350"
          x2="250"
          y2="850"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.504902" stopColor="#E5DBFF" />
          <stop offset="1" stopColor="#898399" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default LogoIconSvg;
