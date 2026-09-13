/* @ds-bundle: {"format":4,"namespace":"AICentralMediaOfficialDesignSystem_019dc1","components":[],"sourceHashes":{"ui_kits/carousel/components.jsx":"98cd53f8bad8","ui_kits/whitepaper/components.jsx":"bff5eaeaa3ea"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.AICentralMediaOfficialDesignSystem_019dc1 = window.AICentralMediaOfficialDesignSystem_019dc1 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// ui_kits/carousel/components.jsx
try { (() => {
// Carousel components — AI Central Media
// Figma reference: /Page-1/external/{Cover1, Cover2, Page1..6, Footer, QuoteBox}

const ASSETS = "../../assets/";

// Pulls in all the building blocks
function Header({
  title = "Document title",
  variant = "dark"
}) {
  const bg = variant === "dark" ? "#333333" : "#FFFDFA";
  const fg = variant === "dark" ? "#E7B02F" : "#333333";
  const arrow = variant === "dark" ? "#FEF7E7" : "#333333";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      height: 80,
      background: bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 56px",
      boxSizing: "border-box"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 32,
      color: fg,
      letterSpacing: "-0.05em",
      lineHeight: 1
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      color: arrow,
      fontSize: 28,
      fontWeight: 700
    }
  }, "\u2197"));
}
function Footer({
  text = "Footer text goes here"
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      height: 80,
      background: "#333333",
      display: "flex",
      alignItems: "center",
      padding: "0 56px",
      boxSizing: "border-box"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 28,
      color: "#E7B02F",
      letterSpacing: "-0.05em"
    }
  }, text), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: "auto",
      color: "#FEF7E7",
      fontSize: 26
    }
  }, "\u2197"));
}
function CornerStripe({
  color = "#046BB1",
  side = "tr"
}) {
  // 9.66px outline jet-black stripe running off-frame
  const base = {
    position: "absolute",
    width: 380,
    height: 380,
    background: color,
    border: "6px solid #333333"
  };
  const pos = side === "tr" ? {
    top: -260,
    right: -160,
    transform: "rotate(45deg)"
  } : {
    bottom: -260,
    left: -160,
    transform: "rotate(45deg)"
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...base,
      ...pos
    }
  });
}
function BigCTA({
  children = "Put here a call to Action"
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "stretch",
      background: "#333333",
      border: "4px solid #333333",
      width: "100%",
      height: 78
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      padding: "0 24px",
      display: "flex",
      alignItems: "center",
      color: "#FEF7E7",
      fontWeight: 700,
      fontSize: 36,
      letterSpacing: "-0.05em",
      lineHeight: 1
    }
  }, children), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 78,
      background: "#FEF7E7",
      border: "3px solid #333333",
      display: "grid",
      placeItems: "center",
      color: "#333333",
      fontWeight: 700,
      fontSize: 36
    }
  }, "\u2197"));
}
function Cover({
  title = "A Big\nTitle Goes\nRight Here",
  subtitle = "and here the document punchy\nsubtitle that explains what you get",
  coBrandLogo,
  stripeColor = "#046BB1"
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 1080,
      height: 1350,
      background: `url(${ASSETS}bg-paper-texture-default.png) center/cover, #FFFDFA`,
      overflow: "hidden",
      boxShadow: "0 0 .5px rgba(0,0,0,.18), 0 3px 8px rgba(0,0,0,.10), 1px 3px 3px rgba(0,0,0,.10)",
      fontFamily: "Inter, sans-serif"
    }
  }, /*#__PURE__*/React.createElement(CornerStripe, {
    color: stripeColor,
    side: "tr"
  }), /*#__PURE__*/React.createElement(CornerStripe, {
    color: "#E7B02F",
    side: "bl"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 56,
      top: 56,
      fontWeight: 500,
      fontSize: 14,
      letterSpacing: "0.05em",
      color: "#333333"
    }
  }, "BROUGHT YOU BY"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 56,
      top: 92,
      display: "flex",
      alignItems: "center",
      gap: 32
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: `${ASSETS}logo-full-light-bg.png`,
    alt: "AI Central",
    style: {
      height: 44
    }
  }), coBrandLogo && /*#__PURE__*/React.createElement("img", {
    src: coBrandLogo,
    alt: "partner",
    style: {
      height: 28,
      opacity: 0.9
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 56,
      top: 380,
      right: 56
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 124,
      fontWeight: 700,
      color: "#333333",
      lineHeight: 0.9,
      letterSpacing: "-0.05em",
      whiteSpace: "pre-line"
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 36,
      fontSize: 30,
      fontWeight: 300,
      color: "#777777",
      lineHeight: 1.0,
      whiteSpace: "pre-line"
    }
  }, subtitle), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 56
    }
  }, /*#__PURE__*/React.createElement(BigCTA, null))));
}
function BodyPage({
  title = "Paragraph Headline",
  body = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.",
  headline = "Lorem ipsum\ndolor sit amet,\nconsectetur."
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 1080,
      height: 1350,
      background: `url(${ASSETS}bg-paper-texture-default.png) center/cover, #FFFDFA`,
      boxShadow: "0 0 .5px rgba(0,0,0,.18), 0 3px 8px rgba(0,0,0,.10)",
      fontFamily: "Inter, sans-serif",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement(Header, {
    title: "Document title"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      padding: "60px 56px",
      display: "flex",
      flexDirection: "column",
      gap: 36
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 110,
      color: "#333333",
      lineHeight: 0.9,
      letterSpacing: "-0.05em",
      whiteSpace: "pre-line"
    }
  }, headline), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 28,
      color: "#333333",
      letterSpacing: "-0.05em",
      marginTop: 20
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 18,
      fontWeight: 300,
      color: "#1A1A1A",
      lineHeight: 1.4,
      columnCount: 2,
      columnGap: 28
    }
  }, body)), /*#__PURE__*/React.createElement(Footer, null));
}
function QuotePage({
  quote = "Senior leaders don't need more content. They need the right cut",
  name = "First Name Last Name",
  role = "Role · Company",
  portrait = `${ASSETS}portrait-quote.png`
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 1080,
      height: 1350,
      background: `url(${ASSETS}bg-paper-texture-default.png) center/cover, #FFFDFA`,
      fontFamily: "Inter, sans-serif",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement(Header, {
    title: "C-level interview"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      padding: "72px 56px",
      display: "flex",
      flexDirection: "column",
      gap: 40
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 240,
      height: 240,
      borderRadius: "50%",
      background: `#D9D9D9 url(${portrait}) center/140% no-repeat`,
      filter: "grayscale(0.4)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 64,
      color: "#333333",
      lineHeight: 0.95,
      letterSpacing: "-0.05em"
    }
  }, "\"", quote, "\""), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 28,
      color: "#333333",
      letterSpacing: "-0.04em"
    }
  }, name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 300,
      fontSize: 22,
      color: "#4A4A4A"
    }
  }, role)), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 90,
      height: 6,
      background: "#1A1A1A",
      marginTop: "auto"
    }
  })), /*#__PURE__*/React.createElement(Footer, {
    text: "Read the full interview"
  }));
}
function BulletList({
  items = ["Skip the noise", "Read the right cut", "Take action with confidence"],
  headline = "Three things\nyou'll learn"
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 1080,
      height: 1350,
      background: `url(${ASSETS}bg-paper-texture-default.png) center/cover, #FFFDFA`,
      fontFamily: "Inter, sans-serif",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement(Header, {
    title: "What's inside"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      padding: "70px 56px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 92,
      color: "#333333",
      lineHeight: 0.9,
      letterSpacing: "-0.05em",
      whiteSpace: "pre-line"
    }
  }, headline), /*#__PURE__*/React.createElement("ol", {
    style: {
      margin: "60px 0 0 0",
      padding: 0,
      listStyle: "none",
      display: "flex",
      flexDirection: "column",
      gap: 26
    }
  }, items.map((it, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: {
      display: "flex",
      gap: 24,
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 78,
      height: 78,
      background: "#FEF7E7",
      border: "4px solid #333333",
      display: "grid",
      placeItems: "center",
      fontWeight: 900,
      fontSize: 36,
      letterSpacing: "-0.04em",
      color: "#333333",
      flex: "0 0 auto"
    }
  }, String(i + 1).padStart(2, "0")), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: 14,
      fontWeight: 600,
      fontSize: 32,
      letterSpacing: "-0.04em",
      color: "#1A1A1A",
      lineHeight: 1.05
    }
  }, it))))), /*#__PURE__*/React.createElement(Footer, null));
}
function FinalCTA({
  headline = "Skip the noise.\nLearn what matters",
  cta = "start learning now"
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 1080,
      height: 1350,
      background: "#333333",
      fontFamily: "Inter, sans-serif",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement(CornerStripe, {
    color: "#E48715",
    side: "tr"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      padding: "120px 56px 80px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: `${ASSETS}logo-full-dark-bg.png`,
    alt: "AI Central",
    style: {
      height: 36,
      alignSelf: "flex-start"
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 124,
      color: "#FEF7E7",
      lineHeight: 0.9,
      letterSpacing: "-0.05em",
      whiteSpace: "pre-line"
    }
  }, headline), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 56,
      display: "inline-flex",
      alignItems: "stretch",
      background: "#FEF7E7",
      border: "4px solid #FEF7E7"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "20px 32px",
      fontWeight: 700,
      fontSize: 40,
      color: "#333333",
      letterSpacing: "-0.05em"
    }
  }, cta), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 80,
      background: "#333333",
      color: "#FEF7E7",
      display: "grid",
      placeItems: "center",
      fontSize: 36,
      fontWeight: 700
    }
  }, "\u2197")))));
}
window.AICCarousel = {
  Cover,
  BodyPage,
  QuotePage,
  BulletList,
  FinalCTA,
  Header,
  Footer,
  BigCTA,
  CornerStripe
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/carousel/components.jsx", error: String((e && e.message) || e) }); }

// ui_kits/whitepaper/components.jsx
try { (() => {
// Whitepaper components — AI Central Media
// A4 = 794 x 1123 @96dpi. Print-oriented.

const ASSETS = "../../assets/";
function WPHeader({
  title = "How senior leaders are using AI"
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      height: 56,
      background: "#333333",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 40px",
      boxSizing: "border-box"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 18,
      color: "#E7B02F",
      letterSpacing: "-0.04em"
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#FEF7E7",
      fontSize: 18
    }
  }, "\u2197"));
}
function WPFooter({
  page = 1,
  total = 12
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      height: 48,
      background: "#333333",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 40px",
      boxSizing: "border-box",
      color: "#FEF7E7",
      fontWeight: 500,
      fontSize: 12,
      letterSpacing: ".05em",
      textTransform: "uppercase"
    }
  }, /*#__PURE__*/React.createElement("div", null, "aicentral.media"), /*#__PURE__*/React.createElement("div", null, "Page ", String(page).padStart(2, "0"), " / ", String(total).padStart(2, "0")));
}
function WhitepaperPage({
  title,
  page,
  total,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 794,
      height: 1123,
      background: `url(${ASSETS}bg-paper-texture-default.png) center/cover, #FFFDFA`,
      fontFamily: "Inter, sans-serif",
      overflow: "hidden",
      boxShadow: "0 0 .5px rgba(0,0,0,.18), 0 6px 16px rgba(0,0,0,.10)",
      display: "flex",
      flexDirection: "column",
      color: "#1A1A1A"
    }
  }, /*#__PURE__*/React.createElement(WPHeader, {
    title: title
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      padding: "44px 56px",
      overflow: "hidden"
    }
  }, children), /*#__PURE__*/React.createElement(WPFooter, {
    page: page,
    total: total
  }));
}
function CornerStripe({
  color = "#046BB1",
  side = "tr"
}) {
  const base = {
    position: "absolute",
    width: 280,
    height: 280,
    background: color,
    border: "4px solid #333"
  };
  const pos = side === "tr" ? {
    top: -190,
    right: -120,
    transform: "rotate(45deg)"
  } : {
    bottom: -190,
    left: -120,
    transform: "rotate(45deg)"
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...base,
      ...pos
    }
  });
}
function Cover({
  title = "How senior\nleaders are\nusing AI",
  subtitle = "7 patterns from 30+ executive interviews\nin AI Central's Q1 cohort",
  coBrand = `${ASSETS}jobstream-logo.png`
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 794,
      height: 1123,
      background: `url(${ASSETS}bg-paper-texture-default.png) center/cover, #FFFDFA`,
      fontFamily: "Inter, sans-serif",
      overflow: "hidden",
      boxShadow: "0 0 .5px rgba(0,0,0,.18), 0 6px 16px rgba(0,0,0,.10)"
    }
  }, /*#__PURE__*/React.createElement(CornerStripe, {
    color: "#046BB1",
    side: "tr"
  }), /*#__PURE__*/React.createElement(CornerStripe, {
    color: "#E7B02F",
    side: "bl"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 56,
      top: 44,
      fontWeight: 500,
      fontSize: 11,
      letterSpacing: "0.05em",
      color: "#333"
    }
  }, "BROUGHT YOU BY"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 56,
      top: 70,
      display: "flex",
      alignItems: "center",
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: `${ASSETS}logo-full-light-bg.png`,
    alt: "AI Central",
    style: {
      height: 28
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      height: 22,
      background: "#333"
    }
  }), /*#__PURE__*/React.createElement("img", {
    src: coBrand,
    alt: "partner",
    style: {
      height: 18,
      opacity: .9
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 56,
      top: 320,
      right: 56
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 84,
      color: "#333",
      lineHeight: 0.9,
      letterSpacing: "-0.05em",
      whiteSpace: "pre-line"
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24,
      fontSize: 22,
      fontWeight: 300,
      color: "#777",
      lineHeight: 1.1,
      whiteSpace: "pre-line"
    }
  }, subtitle), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 36,
      display: "inline-flex",
      border: "3px solid #333"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 18px",
      background: "#333",
      color: "#FEF7E7",
      fontWeight: 700,
      fontSize: 22,
      letterSpacing: "-0.05em"
    }
  }, "read the report"), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 50,
      background: "#FEF7E7",
      color: "#333",
      display: "grid",
      placeItems: "center",
      fontSize: 22,
      fontWeight: 700
    }
  }, "\u2197"))));
}
function SectionHeader({
  n = "01",
  label = "The cohort"
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 16,
      borderBottom: "2px solid #333",
      paddingBottom: 8,
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 900,
      fontSize: 36,
      letterSpacing: "-0.05em",
      color: "#E48715"
    }
  }, n), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 22,
      letterSpacing: "-0.04em",
      color: "#333"
    }
  }, label));
}
function TwoColumn({
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      columnCount: 2,
      columnGap: 28,
      fontSize: 12.5,
      fontWeight: 300,
      lineHeight: 1.45,
      color: "#1A1A1A"
    }
  }, children);
}
function StampImage({
  src = `${ASSETS}photo-grayscale-1.jpg`,
  w = 240,
  h = 160,
  caption
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-block"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: w,
      height: h,
      background: "#333",
      padding: 5
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      height: "100%",
      border: "2px solid #FFFDFA",
      backgroundImage: `url(${src})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      filter: "grayscale(1) contrast(1.05)"
    }
  })), caption && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10.5,
      color: "#4A4A4A",
      marginTop: 6,
      fontWeight: 500,
      letterSpacing: ".02em"
    }
  }, caption));
}
function PullQuote({
  quote = "Senior leaders don't need more content. They need the right cut",
  name = "Maya Okonkwo",
  role = "COO · Northwind Group",
  portrait = `${ASSETS}portrait-quote.png`
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 18,
      alignItems: "flex-start",
      margin: "8px 0 14px",
      padding: "16px 0",
      borderTop: "2px solid #333",
      borderBottom: "2px solid #333"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 84,
      height: 84,
      borderRadius: "50%",
      background: `#D9D9D9 url(${portrait}) center/140% no-repeat`,
      filter: "grayscale(0.5)",
      flex: "0 0 auto"
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 22,
      lineHeight: 1.1,
      letterSpacing: "-0.04em",
      color: "#333"
    }
  }, "\"", quote, "\""), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      fontSize: 12,
      color: "#4A4A4A"
    }
  }, /*#__PURE__*/React.createElement("b", {
    style: {
      color: "#333"
    }
  }, name), " \xB7 ", role)));
}
window.AICWP = {
  WhitepaperPage,
  Cover,
  SectionHeader,
  TwoColumn,
  StampImage,
  PullQuote
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/whitepaper/components.jsx", error: String((e && e.message) || e) }); }

})();
