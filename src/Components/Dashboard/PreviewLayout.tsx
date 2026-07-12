import type { ReactNode } from "react";


interface PreviewLayoutProps
{
    identity: ReactNode;
    currentState: ReactNode;
    recommendation: ReactNode;
    quickActions: ReactNode;
}


export default function PreviewLayout(
{
    identity,
    currentState,
    recommendation,
    quickActions,

}: PreviewLayoutProps)
{

    return (
        <div
            style={{
                width: "95%",
                backgroundColor: "rgba(20,12,55,0.38)",
                borderRadius: "10px",
                padding: "32px",
                display: "flex",
                flexDirection: "column",
                gap: "24px",
            }}
        >

            {/* ================= Identity ================= */}
            <div>
                {identity}
            </div>

            <hr style={{ margin: 0 }} />

            {/* ================= Current State ================= */}
            <div>
                <h4 style={{ opacity: 0.7, marginBottom: "8px" }}>
                    Current State
                </h4>

                {currentState}
            </div>

            <hr style={{ margin: 0 }} />

            {/* ================= Recommendation ================= */}
            <div>
                <h4 style={{ opacity: 0.7, marginBottom: "8px" }}>
                    Recommendation
                </h4>

                {recommendation}
            </div>

            <hr style={{ margin: 0 }} />

            {/* ================= Quick Actions ================= */}
            <div>
                <h4 style={{ opacity: 0.7, marginBottom: "8px" }}>
                    Quick Actions
                </h4>

                {quickActions}
            </div>

        </div>
    );
}