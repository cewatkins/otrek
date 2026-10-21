# OTrek

A browser game of the old Multi-Trek quadrant. You and the robot ships, or that same board with other players. The name on the title is OTrek. The line under it is O for Oxy.

This is not a telnet client and not a proxy to mtrek.com. The rules we cared about were ported into a client-side sim so the game can be published and played in a browser.

## Run

```bash
npm install
npm run dev
```

The dev server listens on port 8080. `npm run build` makes the production bundle.

## Play

The title cue starts when the page can play sound. If the browser is still locked, the button reads CLICK FOR SOUND. The next press is ENGAGE.

| | |
| --- | --- |
| W / S | Warp up and down |
| A / D | Turn left and right |
| Space | Phasers |
| T | Torpedo |
| . | Dock, when you are close and slow |
| Click | Lock a ship, or set a course |

**Solo** is one player and the robot ships. No one else.

**Quadrant** is that same board, plus whoever else opened it. The fight between players goes browser to browser. The app serves the handshake. There is one shared board, not a list of private rooms.

Everyone starts in **Alpha**. The wormhole, when it is open, is the door to **Beta**. Cloaked ships cannot take it, and a ship has to wait before the mouth will take it again.

## What we took from the original

The playable chart is the Alpha and Beta list published in the [mtrek.com FAQ](http://mtrek.com/guides/frequently-asked-questions/). Earth, Vulcan, Romulus, Klinzhai, Gorn, Orion, the starbases, and the named worlds sit in those relative positions, fitted onto this board so the patrol distances still work. The far pocket of Alpha (Hyperion and the systems out past it) is left off so the chart you actually fly is the one players know.

Ship classes and the stat table follow the JavaTrek constructors and the mtrek.com player’s guide. The shipyard can show that table, or the numbers this smaller patrol uses. Gold banks when you dock. Dilithium soaks a hit that gets through the shields. Some classes carry drones, mines, a cloak, regenerating torpedoes, or an agonizer.

The robots are the ones that belong on that board: IKS Torg, IRW Vorel, OSS Slammer, CDS Galor, USS Hood, USS Farragut, USS Yorktown, and IKS Gr'oth. They launch from their own homes.

## How this was built

We started from the request for a web version of mtrek.com, and kept steering it back toward the game people actually played.

1. **A sim, not a terminal.** The first cut was a canvas patrol with the class table, docking, and gold. Telnet to port 1701 was never the product.
2. **The real numbers, then a patrol that fits.** The guide’s ranges assume a huge chart. The shipyard keeps those figures. The running game uses a fitted chart so a phaser still means something.
3. **One quadrant.** Private rooms were the wrong shape. Solo is you and the robots. Quadrant is the original idea: one board, the robots, and whoever else is on it.
4. **The cabinet, not the brown page.** The look went black. Ships are painted sprites, Federation grey, Klingon darker, Romulan green. The window is split the way the 1982 Sega Strategic Operations Simulator was split: status, a top-down plot, and a forward view. That is a layout homage. It is not the ROM, and it does not ship ROM audio or studio photographs.
5. **Sound we could publish.** Phasers, torpedoes, hits, and the title cue are synthesized in the browser. Nothing is ripped from the arcade board or from a television theme.
6. **A name that stuck.** The title, the tab, and the share cards all say OTrek. The preview image and the wide X banner use the same lockup.

## Layout

| Path | What it is |
| --- | --- |
| `src/game/sim.ts` | The quadrant, the chart, the robots, combat |
| `src/game/classes.ts` | Classes and the guide table |
| `src/game/draw.ts` | Plot, forward view, sprites |
| `src/game/audio.ts` | Title cue and weapon sounds |
| `src/components/mtrek/` | Title, shipyard, bridge |
| `src/lib/multiplayer/` | Browser-to-browser links for the quadrant |
| `public/ships/` | Ship pictures |
| `public/og.jpg`, `public/x-banner.jpg` | Share images |

Gold already banked stays in the browser under `mtrek-web-v1`.
