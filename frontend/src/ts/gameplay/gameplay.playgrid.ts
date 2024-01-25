import { Ref, ref } from "vue";
import { Field } from "./i/gameplay.i.field";
import { Grid } from "./i/gameplay.i.grid";
import { Row } from "./i/gameplay.i.row";
import { angle } from "./gameplay.angle";
import { GRID_EXTRA_HEIGHT, GRID_HEIGHT, GRID_WIDTH } from "../game-settings/game-settings.game";

export const playGridASCII: Ref<string> = ref("");
export const playGrid: Grid = {
    visualWidth: 0,
    visualHeight: 0,
    gridWidth: 0,
    gridHeight: 0,
    extraGridHeight: 0,
    rows: [],
    bubbleRadius: 0
}

export function setupGrid(): void {
    const WIDTH_UNITS = 100000000;
    playGrid.visualWidth = WIDTH_UNITS;
    playGrid.visualHeight = Math.floor(WIDTH_UNITS/GRID_WIDTH.value*GRID_HEIGHT.value);
    playGrid.gridWidth = GRID_WIDTH.value;
    playGrid.gridHeight = GRID_HEIGHT.value;
    playGrid.extraGridHeight = GRID_EXTRA_HEIGHT.value;
    playGrid.bubbleRadius = WIDTH_UNITS / (2 * playGrid.gridWidth);
    for (let h = 0; h < playGrid.gridHeight; h++) {
        const row: Row = {
            fields: [],
            size: playGrid.gridWidth - ((h % 2 === 0) ? 0 : 1),
            isEven: h % 2 === 0,
        }
        for (let w = 0; w < row.size; w++) {
            const field: Field = {
                coords: {
                    x: w,
                    y: h,
                },
            };
            row.fields.push(field)
        }
        playGrid.rows.push(row);
    }
    generateASCIIBoard();
}

function generateASCIIBoard(): void {
    let boardText = "";
    playGrid.rows.forEach(row => {
        if (!row.isEven) {
            boardText += "|.. ";
        } else {
            boardText += "| ";
        }

        row.fields.forEach(field => {
            const bubbleASCII = field.bubble ? field.bubble.ascii : "-"
            boardText += `-${bubbleASCII}- `
        });

        if (!row.isEven) {
            boardText += "..|\n";
        } else {
            boardText += "|\n";
        }
    });
    boardText += "|_________________________________|\n| . . . . . . . . . . . . . . . . |\n| . . . . . . . . . . . . . . . . |";
    boardText += `\n| . . . . . . . .${getASCIIArrow()}. . . . . . . . |\n\n`;
    playGridASCII.value = boardText;
    requestAnimationFrame(() => generateASCIIBoard());
}

function getASCIIArrow(): string {
    const currentAngle = angle.value;
    if (currentAngle < 22.5) {
        return "←"
    }
    if (currentAngle < 67.5) {
        return "↖"
    }
    if (currentAngle < 112.5) {
        return "↑"
    }
    if (currentAngle < 157.5) {
        return "↗"
    }
    return "→"
}

// function addGarbage(): void {

// }