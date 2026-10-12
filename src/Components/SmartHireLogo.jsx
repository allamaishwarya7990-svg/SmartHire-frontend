import React from "react";
import { Briefcase } from "lucide-react";

export default function SmartHireLogo({ size = "md", showText = true, className = "" }) {
    const sizeMap = {
        sm: { iconSize: 16, boxSize: 30, fontSize: 18, radius: 8 },
        md: { iconSize: 20, boxSize: 36, fontSize: 21, radius: 10 },
        lg: { iconSize: 26, boxSize: 48, fontSize: 28, radius: 14 }
    };

    const cfg = sizeMap[size] || sizeMap.md;

    return (
        <div
            className={`smarthire-brand-logo ${className}`}
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                textDecoration: "none",
                userSelect: "none"
            }}
        >
            <div
                style={{
                    width: `${cfg.boxSize}px`,
                    height: `${cfg.boxSize}px`,
                    borderRadius: `${cfg.radius}px`,
                    background: "linear-gradient(135deg, #00C98B 0%, #087C60 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#080B12",
                    boxShadow: "0 4px 14px rgba(0, 201, 139, 0.28)",
                    flexShrink: 0
                }}
            >
                <Briefcase size={cfg.iconSize} strokeWidth={2.4} color="#080B12" />
            </div>
            {showText && (
                <span
                    style={{
                        fontSize: `${cfg.fontSize}px`,
                        fontWeight: 800,
                        letterSpacing: "-0.03em",
                        color: "#F8FAFC",
                        lineHeight: 1
                    }}
                >
                    Smart<span style={{ color: "#00C98B" }}>Hire</span>
                </span>
            )}
        </div>
    );
}
