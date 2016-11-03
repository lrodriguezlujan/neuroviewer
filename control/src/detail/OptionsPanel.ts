import {Drawer} from "@neuroviewer/core";
import {ControlPanel} from "./ControlPanel";

export class OptionsControlPanel  extends ControlPanel {

  private static options_name = "Options";

  public constructor(parentDiv: HTMLElement, d: Drawer){
    super("Options", parentDiv);

    // Mark panes as options panel
    this.panelDiv.classList.add("optionsPanel");

    // Default size and position
    this.move(10,50);
    this.resize(100,500);
  }
}
