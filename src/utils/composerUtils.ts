/*
  Utility functions that will probably only be used for the groove composer
*/

// Top positions for notes on staff
const aTop  = 33.5
const gTop  = 38.5
const fTop  = 44.5
const eTop = 50.5
const dTop = 56.5
const cTop = 61.5
const BTop = 67.5
const ATop = 73.5
const GTop = 79.5
const FTop = 85.5
const ETop = 91.5
const DTop = 97.5
const DBottom = 110.5

// takes as many parameters (just numbers, not in an array) as you give it, and returns an average
function getAverage(...args: Array<number>) {
  let sum = 0
  for(let i = 0; i < arguments.length; i++) {
    sum += arguments[i]
  }
  
  return sum / arguments.length
}

// Middle positions for notes on staff
const aMiddle  = getAverage(aTop, fTop)
const gMiddle  = getAverage(gTop, eTop)
const fMiddle  = getAverage(fTop, dTop)
const eMiddle = getAverage(eTop, cTop)
const dMiddle = getAverage(dTop, BTop)
const cMiddle = getAverage(cTop, ATop)
const BMiddle = getAverage(BTop, GTop)
const AMiddle = getAverage(ATop, FTop)
const GMiddle = getAverage(GTop, ETop)
const FMiddle = getAverage(FTop, DTop)
const EMiddle = getAverage(ETop, getAverage(DTop, DBottom))
const DMiddle = getAverage(DTop, DBottom)

/*
  The average between two middles is the selection boundary.
  Use case: if mouse y-position is between two selection boundaries,
  the indended note is known. On hover, the proper unplaced note can
  be displayed. On click, the proper note can be placed.
*/
const aSelectionTop = aTop
const gSelectionTop = getAverage(aMiddle, gMiddle)
const fSelectionTop = getAverage(gMiddle, fMiddle)
const eSelectionTop = getAverage(fMiddle, eMiddle) + 1
const dSelectionTop = getAverage(eMiddle, dMiddle)
const cSelectionTop = getAverage(dMiddle, cMiddle) + 1
const BSelectionTop = getAverage(cMiddle, BMiddle) + 1
const ASelectionTop = getAverage(BMiddle, AMiddle) + 1
const GSelectionTop = getAverage(AMiddle, GMiddle)
const FSelectionTop = getAverage(GMiddle, FMiddle) + 1
const ESelectionTop = getAverage(FMiddle, EMiddle) + 1
const DSelectionTop = getAverage(EMiddle, DMiddle)
const DSelectionBottom = DBottom

export const floatToFraction = (float: number) => {
  switch (float) {
    case .125: return "1/8"
    case .25: return "1/4"
    case .5: return "1/2"
    case 1: return "1"
    case 2: return "2"
    case 4: return "4"
  }
}

// Takes abcNote, and evaluates the fraction returned by getNoteLengthAsFraction
export const getNoteLengthAsFloat = (abcNote: string) => {
  // extract fraction
  const fraction = getNoteLengthAsFraction(abcNote)
  // convert to float
  const split = fraction.split("/")                                       
  return parseFloat(split[0]) / parseFloat(split[1])
}

// Takes abcNote (e.x., "[z]2"), returns fraction (string) representing duration of note
export const getNoteLengthAsFraction = (abcNote: string) : string => {
  const regex = /(?!])(\d+)(?:\/)*(\d+)*/
  const matchArray = abcNote.match(regex)
  return `${matchArray[1]}/${matchArray[2] || 1}`
}

export const getNoteWidthInPx = (abcNote: string, barWidth: number) => {                                      
  const float = getNoteLengthAsFloat(abcNote)
  const percentage = float / 4 * 100
  // convert that to pixels
  return percentage * barWidth / 100
}

// Returns abc notation for a note based on cursor's y-position on the staff. Used for displaying unplaced notes
export const intendedNoteByMouseY = (y: number) : string | false => {
  switch(true) {
    case (aSelectionTop < y && y <= gSelectionTop): return "^A'"
    case (gSelectionTop < y && y <= fSelectionTop): return "^g"
    case (fSelectionTop < y && y <= eSelectionTop): return "f"
    case (eSelectionTop < y && y <= dSelectionTop): return "e"
    case (dSelectionTop < y && y <= cSelectionTop): return "d"
    case (cSelectionTop < y && y <= BSelectionTop): return "c"
    case (BSelectionTop < y && y <= ASelectionTop): return "B"
    case (ASelectionTop < y && y <= GSelectionTop): return "A"
    case (GSelectionTop < y && y <= FSelectionTop): return "G"
    case (FSelectionTop < y && y <= ESelectionTop): return "F"
    case (ESelectionTop < y && y <= DSelectionTop): return "E"
    case (DSelectionTop < y && y <= DSelectionBottom): return "^D"
    default: return false
  }
}

export const noteTopPosByAbcNote = {
  "^A'": aTop, 
  "^g": gTop,
  "f": fTop,
  "e": eTop, 
  "d": dTop, 
  "c": cTop, 
  "B": BTop, 
  "A": ATop, 
  "G": GTop, 
  "F": FTop, 
  "E": ETop, 
  "^D": DTop,
  "z": 0
}

export const timeSignatureStringToSVGCtName = {
  "2/4": "TwoFour",
  "3/4": "ThreeFour",
  "4/4": "FourFour",
  "6/8": "SixEight"
}

export const optionsToSVGNoteCtName = (options: { noteLength: string, noteType: string }) : string => {
  let typeString;

  if (options.noteType === "note") typeString = "Note";
  if (options.noteType === "rest") typeString = "Rest";

  switch (true) {
    case options.noteLength === "4" || options.noteLength === "4/1":
      return `Whole${typeString}`
    case options.noteLength === "2" || options.noteLength === "2/1":
      return `Half${typeString}`
    case options.noteLength === "1" || options.noteLength === "1/1":
      return `Quarter${typeString}`
    case options.noteLength === "1/2":
      return `Eighth${typeString}`
    case options.noteLength === "1/4":
      return `Sixteenth${typeString}`
    case options.noteLength === "1/8":
      return `Thirtysecond${typeString}`
  }
}