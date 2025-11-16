import kaplay from "kaplay";

const k = kaplay(
    {
        background: [32, 230, 228],
        buttons: {
            jump: {
                keyboard: ["w"],
                mouse: "left"
            }
        },
        touchToMouse: true
    }
)

export default k;