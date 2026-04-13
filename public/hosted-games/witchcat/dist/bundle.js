function clamp(value, minValue, maxValue) {
  return Math.max(minValue, Math.min(maxValue, value));
}

let seasonList = ['spring', 'summer', 'fall', 'winter'];
let availableSeasons = [];
let currentSeason;
// spring _colors
let COLOR_SETS = {
  spring: [
    '2d2122',
    '5f4d2e',
    '519034',
    '76af2b',
    '8ec42b',
    'b7c42b',
    '576c87', // water
    '6b94ab', // water
  ],
  summer: [
    '2d2122',
    '8b4f44',
    'c89132',
    'e4b000',
    'e4ce00',
    'ffe224',
    '576c87', // water
    '6b94ab', // water
  ],
  fall: [
    '2d2122',
    '802c36',
    'c16624',
    'dc752b',
    'e2892c',
    'fab770',
    '6e5b86', // water
    '9b7ba3', // water
  ],
  winter: [
    '2d2122',
    '644683',
    '7382dd',
    '9dace0',
    'aac4e1',
    'c2e8f7',
    'cfd3e1', // water (ice)
  ],
  _dungeon: ['0d1b2a', '5a5a7c', '73849c', '3b2e72'],
  _trap: ['0d1b2a', '73849c', 'c2e8f7', '3b2e72'],
};

// Orientation constants
const ORIENTATION_UP = 1;
const ORIENTATION_RIGHT = 2;
const ORIENTATION_DOWN = 3;
const ORIENTATION_LEFT = 4;

// CAUTION! If new assets are added, push them at the end of the object, or it will break RLE
const TILE_DATA = {
  grass: {
    _rle: '16MD[ESB[AMDMAMANBZAMAMKYAO[QZAYO[NAMA[OAMZMCM[NAMBYNDZNA[AYDMAYEZCZAMAYCYBZAZAZMCZBZAZM[AM[ANYMYNAZNZMAPZAMAYBYPANZMBYDMAMDYANLYA',
    _colors: [2, 4],
    _isStatic: true,
  },
  plant: {
    _rle: '16B[EPBMB[AMfBRfCfAeCMBeBeBeBeMYCMfAeMAMfRAMfNBPAMAMBOENfAMAZNCZAfAeAZE[AeBeMYBfBZBMfNBfAeAYNBOANeBeNBfAYAYANfNBeBeBYAQCfAeMAYPANBMfNAYJOC',
    _colors: [2, 4, 5],
    _isStatic: true,
  },
  water: {
    _rle: '128LLINYfddZLLINZfddYLAMHNCMFMYfddZLAMHNCMFMZfddYINBPCOCOFMfddZINBPCOCOFMYfddYGPCPCNBM[PCMeddZGPCPCNBM[PCMfddYHPBM[MBMYN`Oedd[HPBM[MBMYN`OfddZDNCMZMAMYgMAMpgdd[DNCMZMAM\\MAMdZfddZCNYOhMjMpgdd\\CNYO\\MYiMphdd[CMZnddddCM]ppgdd\\DMhdddd_DMZlddddYEMeddddaEMgdddd_BOeddddbBOYfdddd`CNeddddbCNYeddddaEMddddbEMeddddaFMddddaFMddddaNEMdddd`NEMdddd`SddddaSdddda',
    _colors: [1, 6, 7],
    _animationSpeed: 900,
    _animationStep: 0,
  },
  ice: {
    _rle: '64LLIN[gYe[g]eYe]fLAMHNCMFMZeYeYe[g]eYe]gINBPCOCOFMeYeYe[g]g]eYeYGPCPCNBNfPCMe]eYe]gYe[eYeZHPBM[MBMYNYg\\Oe]eYe]gYe[eYe[DNCMfMAMZfMAM[g]eYe[eYeYe]eYeYe[g[eCNYOfZMZgYM[g]g[eYg]eYeYe[g[eYCM[eYeYe[g]gYe[g[eYg]eYe]eYe[eYeDMYeYeYe[eYe[eYeYeYe[g[eYg]g]eYeYeYeYeYEMYeYe[eYe[eYeYeYe[eYe[eYg]eYe]eYeYe[eYeBOf]eYe[eYeYeYe[eYe]eYe]eYe]gYe[gYCNe]gYeYeYgYeYeYeYe]eYe]eYe]gYe[gZEM\\eYeYe[g[eYg]eYe]eYeYe[g]gYeYFMZeYeYe[g[eYgYe[gYe[gYe[gYe[gYeZNEMeYe]g[eYgYe[gYe[gYe[gYe[gYe[Sg]g[eYgYe[gYe[gYe[g]g]e',
    _colors: [1, 3, 6],
    _isStatic: true,
  },
  character: {
    _rle: '64LLLLLLLLLLLLLLLLHOLLLLLQIOLFOLLBRGQLDQLOIQHRLCSJQHM[MJQLAMZNLSCVHVCTZMKMZNEMbNDNYQYPAN_OETZMDMZT[MBOYQYRZQ[NCN_ODMYWZQZOZRYUZMBMZQ[NCTeQYR]RAOeTYMAMYUZMBOePeOeXSBNeQeOYMAOeTYMBNeMeMfMeMeXRDMeMgMeOYMBNeQeOYMAOfMfMfOBXNCMfMhRCMeMgMeOYMBNlNDXDMkQCMfMhRDMjMHTGMiPEMkQDMeReMFMeNfNeMGQJMiPEMeOfNfMEMeRfMGMfNJRHMeSfMFTeMGMfOJMfOHWEVHSHNfQFMgRFWFUFWEVFWFUFWB',
    _colors: ['000', 3, 'ffaa87'],
    _collisionPadding: [18, 4, 1, 4],
    size: [1, 1.5],
  },
  tree: {
    _rle: '32FNBRAPLDMYeN[gMYfYOAOHMYjZfYgYfYMfYMGOfYfafZhMEMfdZfZjMCMgddYMBMYfYfdZhYNYMAMYeMYi`f\\hYMBMeM[gYMf[jMfZfNAN[gNfZMgYMgMfYMeOYMYNgMgYNgYMgMgYMYNePeOgPfNfOfNYNeMZNYNfNZNeOePeMYMBMe_MeM\\NZN[NZMAMfYMeYe[MZebe[eMAMfMhM\\fYMeYe[eYfYgNeOfMfYMgMiYfMfNfMANYNeMfMgNfMfMfMeRAMfYReYOeReOYeYMBMg\\QYO\\OYeYgMAMfMYfYeZfZfZf\\fMfMBOgNYgYMfNgYMgOEMfPfTfNfMIOqXRHrMtNrMrNqNtNrDrM[qMtMsMrNqYsMrBrM[qMZrNZqMsMq\\qMrAqMZsMZrMqZqMqZOqZrMqAqMrOZsMqZqMq[qPrMCtMZrO\\Nq[rMrMqDwOqZsPZqOqGwSyD',
    _colors: [0, 2, 4, 1],
    _isStatic: true,
    size: [2, 2],
  },
  hole: {
    _rle: '16AeBYeAZAeYBeAeMYeMZNZMeYMeAYMYTYMYAfXfZXZXPeXNeAYXYBYXYAeXNeXPZXZfXfAYMYTYMYAeMYeMZNZMeYMeAeBYeAZAeYBeA',
    _colors: [0, 6],
    _isStatic: true,
  },
  leaves: {
    _rle: '16eYPeSf[OfNhMeMYMfNYMfMZQeMYOeMZQeMeYPZNfMgYMhOfYQfMeSfNfMeYNhMgMgYNfMYNePeYOfZMeNfSZNeMeMeYNfTf[MfYNgOeZMgYMgYMePgYNfYNfT[Ne',
    _colors: [1, 2, 4],
    _isStatic: true,
  },
  bush: {
    _rle: '16LEPFPBMeZMrBM[MBMe[MrM\\MqAMfYqPrfMqBNqMYfYMqNrAMZMYhYMqYMqAMeYMjMYeMqAMfNYfYNfMqBNYqPqYNrAMqbqMqAM]eMe\\MqAMeZfNfZeMqAMhMrMhMqBPsAPrDtDsA',
    _colors: ['000', 2, 4, 1],
  },
  cat: {
    _rle: '16IMCMJMYMAMYMHMYqeMeqMGMYkMFMYkMBOAMlMAMZeNfMeYeMeNYeMYNgYqYfNeMAOf]MAMfNZg[MBMf[jNCMnYMCMnYMCMgPgNCMfNCMeMeMCMYMeMCMYMeMB',
    _colors: ['000', '222', '444', 'e54350'],
  },
  fireball: {
    _rle: '32LLLLLLLLLLLBPLPKM\\MJMhMIMZfZMHMfZfMHMYhYMHMe\\eMHMYhYMHMe\\eMHMZfZMHMfZfMIM\\MJMhMKPLPLLLLLLLLLLLB',
    _colors: COLOR_SETS.fall,
    _animationSpeed: 100,
    _moveSpeed: 3,
    _collisionPadding: [7, 7, 7, 7],
  },
  wall: {
    _rle: '112XqXOqXOrQqXP|M|sPxRYlYMYpeYMYplYMYkYS|M|sPxQYnMpgMpnMmYOqN|M|sMqNxNqNfYTqXOqXVqTYeYOYMqbqMqdYqNYMq^qMYOfMd\\MZqd[Md\\q[MfPYTqRsQtPYTYPfM_M]qZP]q[sQYtbM[MfOsfqMqpeqMqjNsjsNqNqYqZqZMZqZqZMZMZqZq_q]q`sPYMfNs\\Md[M_Ms`sNfMYqZqZqZrYMZqZqZu^M]MdYqZMfOr\\Md[q_Nr`rOfMYMZMqNZqZNrZMZqZq[sOqPq]q^qZMfNqMq\\Md[M_MqMq`qMqNfMYPZOqZMZqZOqZq]q]M`M^MZMfOYM\\MqdZM_NYM`MYOfMYqZMZqZqZq]MZqZqcq^qOqRqMfPYqZqRqZqQqMq^OYq^qYPfM_qcqdYqOrdZMZMfOqYQiPiWqYTYqOfYQqXRqR\\M]Rq]qZqNqMshM]MfM]MlMslsNYjYMYphYMYhYM[q\\MYhYMYvYMfMqMr\\q]qZq]q`qMr`rMqNYjMpjMjM`MjM`MfMrMq\\q]qZq]q`rMq`qMrUqXRqOYfM`MfZfM`MfMYrXXQYrVrY',
    _colors: COLOR_SETS._dungeon,
    _isStatic: true,
  },
  snow: {
    _rle: '112eqeYQYgYP\\X\\X\\RYeqeMYevlxkMYezeYMqYNYgYQ[RYlYRYlYRYgYNYqMYftosnMYfxfYMeMYetf[greZf{eZf{eZfueYMeMYm^n]MYpYMYMe||||zeMYMZidYg`MZnZNY|||||YNdd_MdZNe|||||eOdd^NdOe|||||eOdd^NdOe|||||eOdd^NdOe||||{eYOdd^NdOe||||{eMYNdd^NdOe||||{YMeNdd^NdOY||||{YMeYMdd_MdMZMe||||zYMeYNd_P_NbNYeMYe||||yeMYePdYXZeP^PeqYNYo|||yeYMqeXXRqeXeqeqeYX|||yeYMeqeZXQ\\ReqeZRZeqe',
    _colors: [1, 3, 5, 6],
    _isStatic: true,
  },
  spikes: {
    _rle: '32LGMGMLJMYMEMYMLIMYMEMYMDQCQCNYNCNYNCNYNCNYNCMeYeMCMeYeMCNYNCNYNCMqYqMCMqYqMCQCQCQCQLLLLEMGMLJMYMEMYMLIMYMEMYMDQCQCNYNCNYNCNYNCNYNCMeYeMCMeYeMCNYNCNYNCMqYqMCMqYqMCQCQCQCQLLJ',
    _animationSpeed: 1200,
    _colors: COLOR_SETS._dungeon,
  },
  blade: {
    _rle: '16GNLAMYeMKMYfYMJMqfqMIMqhqMFNrPrNCMYqeMqZqMeqYMAMhM\\MhNYgMqZqMgYOYqeReqYNAOrPrOCOqhqOFNqfqNIMYfYMJNZNKPF',
    _colors: COLOR_SETS._trap,
    _moveSpeed: 2.5,
    _returningMoveSpeed: 0.75,
    _collisionPadding: [1, 1, 1, 1],
  },
  seeker: {
    _rle: '32DPLFNHMgMLEMeMHMZeMHQCMYeMGRCNAMgRYeMFNhPeNeZNhNeMENfNfMZeRfNfODMeMfNfMYfMCNfNfOCMfMYhYMfMCOYhYOBMfYN\\NeNBMYO\\OYMAMe[TYMBNeSYMYMAMeTYNYMBNeYRZQYOf[NYMBNe[O\\eMAMZOfZMZMBNeZOiMBNZfMfYMYNBNeYMgRCSgNDNeUEVFVC',
    _colors: COLOR_SETS._trap,
    _animationSpeed: 100,
    _moveSpeed: 1.3,
    _collisionPadding: [1, 1, 1, 1],
  },
  heart: {
    _rle: '16LLLLDNCNHMZMAMZMFM\\M\\MEMaMEMaMFM_MHM]MJM[MLMYMLBMLLLLH',
    _colors: ['000', 'f00', 'fff'],
  },
  ground: {
    _rle: '16riseZeYreYeYeZqeZeYfq[e[qZeYeYeq_qYeYeYfq_q\\gq_q[eYfq_q^eqSqSrisgYereYeYgqeYe\\q[eYfqYe]q\\eYeq_q_q^eq_q]eYq_q\\gqSqS',
    _colors: ['514970', '7676a2', '8686b4', '6a648e'],
    _isStatic: true,
  },
  crack: {
    _rle: '16XSeZMYM[ePYNqNqMtMYNZOrMsYMYNqYNsMsNYXQYfN\\MYNf\\OsMqMq^MYMsOq^MqMrOr[XQYfYMZMZMYfNZrMrMrMqZN[qNqMrNZN[rOsNYO[qNsZO',
    _colors: COLOR_SETS._dungeon,
    _isStatic: true,
  },
  liana: {
    _rle: '16QZMYQYOr[MetfOrZMqfseNrMZNqMeMreNfqZNqMeYMZNgZNrM[fMqgYMgMZMfsNZfNZMqetMZeNZNvMeYNqYMgrPfNqZfPsfMr[NqNsYeMqZMZrNrfYMZOZqNqg\\MqfZOfM\\MqfMYM',
    _colors: ['0d1b2a', 2, 4, '3b2e72'],
    _isStatic: true,
  },
  mommy: {
    _rle: '16DSFOf[fMDMZMe^eMCMfNYNYMYeNBMZSYeMYMAMfM\\hMZNZMf]eMeYNfMeZfOZeNeZMeZMZeZeMAMeYePZeYeMCMjRBM_iMBMhOe\\MAM\\QhX]MAXO',
    _colors: COLOR_SETS._dungeon,
    _animationSpeed: 400,
    _moveSpeed: 0.8,
    _moveDirection: ORIENTATION_RIGHT,
    _collisionPadding: [1, 1, 1, 1],
  },
  skeleton: {
    _rle: '16FRIMjMGMgYhMFMeNZNeMCPeMhMeOAMfMYfNfYMeMAMfOhNfMBMgMeNeMfMBMYMfReMYMAQZNZNYMAMfMYNZNYOAMfNZNZMfMBWfMDMfOZODMgRFQH',
    _colors: COLOR_SETS._dungeon,
    _animationSpeed: 500,
    _moveSpeed: 0.8,
    _moveDirection: ORIENTATION_DOWN,
    _collisionPadding: [1, 1, 1, 1],
  },
  rock: {
    _rle: '16DsQqFqYiZMqDqfYgZqNDqg[tMCqjuMqBqf]tMqBqe^uMAqf_tMAqe`tMre`uMqM_vMqM^qMuMqMq\\qOsNAqMqZqTqBqWrD{A',
    _colors: [0, 2, 5, 1],
    _isStatic: true,
  },
  root: {
    _rle: '16BPKMgYMBQBMg[Nf[MAMfYNYMf]NeYQeZOYN[OeZQBM[NeYOYNCMZNZN[MCMYOZOYeMDUfMDMfZPfMCMf\\OfMBMe^NfYMBM[NZMeZMCMZNAMYMZMDMZMDMZMC',
    _colors: [0, 1, 2],
    _isStatic: true,
  },
  checkpoint: {
    _rle: '16LLLLLLLLLLLLLLLLLLLLLD',
    _colors: [],
    _isStatic: true,
  },
  trigger: {
    _rle: '16FPJNYfYNGMe]eYMEMeYeYre[MCMqZrZreYqMAM[q^qeZNeYqYe[fYqYeNeYqeqeYfqYqYeNeYeqe]q[NYeZrZrZeYMAMqeYeYr[eqMCMeqe\\eqYMEMYfreZMGN\\NJPLJ',
    _colors: [...COLOR_SETS._dungeon],
    _animationSpeed: 900,
  },
  orb: {
    _rle: '32LDfDhDfAfAlAfAgAlAgAhYPYhBhYPYhCfqM\\MqfDfqMq[MqfCfqMZfZMqfBfqMrYeZMqfBeYM[fsMYeBeYMqf]MYeBeMZeZrerMeAfMqgqYfZMfAeMsYrgYMeAfMresfrMfAeMqftfYMeAfMYyMfAeMqfs\\MeAfMZet[MfAeYMvZMYeBeYM[qfZMYeBfqMZqerMqfBfqMsfYMqfCfqMYsMqfDfqMsYMqfChYPYhBhYPYhBfAlAfAgAlAgLDfDhDf',
    _colors: [0, 2, 5, 1],
    _animationSpeed: 340,
  },
  signpanel: {
    _rle: '16AXNAMYpYNqdqXRqMYlYMqNqMeMYeMeOeMqNYMkMfMYNYMePYeNeMeNYMYlYMYXRq[j[qMAXNGMrMKqMrMqIrMZMrIvE',
    _colors: COLOR_SETS._dungeon,
  },
  mushroom: {
    _rle: '16ERHNhYqNEMqi[qMCM[g^MAMqafZNh]hqNi\\hqNj\\frMAMYh]rMCMq[vMENvNFqTqEsNrNsDtMZMtEzHvE',
    _colors: [0, 2, 5, 1],
    _isStatic: true,
  },
  stoneflower: {
    _rle: '16GYOIPqeMGOqMeZNFNYeqMYMeMFMqMYeqMeZMEMeqMYMeZNEMfqMeZMeMEMeYeqMYMeYMEMeqeqNeZMDNgqMeYMYNBMeMYgMe[MeMAMqeMZeMeZMYeMAMqfSYfMAeMseYNYgMYBeQBPYLF',
    _colors: COLOR_SETS._dungeon,
  },
  flower: {
    _rle: '16LJOINAM[MANDMZM]MZMCMZNYMYNZMBOZQZNBMZNqYqYqNZMAMZMqYqYqYqMZMANYNqYqYqNYNBNYSYNBQ]QAMgSgMAMfMgMgMfMBNgOgNDQAQLG',
    _colors: ['000', 5, 2, 6],
  },
};

// Game constants
const TILE_SIZE = 16; // Original tile size in pixels
const WORLD_WIDTH = 100;
const WORLD_HEIGHT = 63;
const DISPLAY_WIDTH = 27;
const DISPLAY_HEIGHT = 15;

const BLOCKING_TILES = [
  'tree',
  'bush',
  'wall',
  'crack',
  'rock',
  'snow',
  'root',
  'signpanel',
  'mushroom',
  'stoneflower',
  'flower',
];
const HOLE_PADDING = [10, 7, 5, 7];

// Seasonal tile replacements
const SEASON_REPLACE = {
  fall: { hole: 'leaves' },
  winter: { water: 'ice' },
  summer: { crack: 'liana' },
  spring: { stoneflower: 'flower' },
};
const HIDE_UNLESS = { snow: 'winter', root: 'summer', mushroom: 'fall' };

/* -*- mode: javascript; tab-width: 4; indent-tabs-mode: nil; -*-
 *
 * Copyright (c) 2011-2013 Marcus Geelnard
 *
 * This software is provided 'as-is', without any express or implied
 * warranty. In no event will the authors be held liable for any damages
 * arising from the use of this software.
 *
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 *
 * 1. The origin of this software must not be misrepresented; you must not
 *    claim that you wrote the original software. If you use this software
 *    in a product, an acknowledgment in the product documentation would be
 *    appreciated but is not required.
 *
 * 2. Altered source versions must be plainly marked as such, and must not be
 *    misrepresented as being the original software.
 *
 * 3. This notice may not be removed or altered from any source
 *    distribution.
 *
 */

'use strict';

// Some general notes and recommendations:
//  * This code uses modern ECMAScript features, such as ** instead of
//    Math.pow(). You may have to modify the code to make it work on older
//    browsers.
//  * If you're not using all the functionality (e.g. not all oscillator types,
//    or certain effects), you can reduce the size of the player routine even
//    further by deleting the code.

var CPlayer = function () {
  //--------------------------------------------------------------------------
  // Private methods
  //--------------------------------------------------------------------------

  // Oscillators
  var osc_sin = function (value) {
    return Math.sin(value * 6.283184);
  };

  var osc_saw = function (value) {
    return 2 * (value % 1) - 1;
  };

  var osc_square = function (value) {
    return value % 1 < 0.5 ? 1 : -1;
  };

  var osc_tri = function (value) {
    var v2 = (value % 1) * 4;
    if (v2 < 2) return v2 - 1;
    return 3 - v2;
  };

  var getnotefreq = function (n) {
    // 174.61.. / 44100 = 0.003959503758 (F3)
    return 0.003959503758 * 2 ** ((n - 128) / 12);
  };

  var createNote = function (instr, n, rowLen) {
    var osc1 = mOscillators[instr.i[0]],
      o1vol = instr.i[1],
      o1xenv = instr.i[3] / 32,
      osc2 = mOscillators[instr.i[4]],
      o2vol = instr.i[5],
      o2xenv = instr.i[8] / 32,
      noiseVol = instr.i[9],
      attack = instr.i[10] * instr.i[10] * 4,
      sustain = instr.i[11] * instr.i[11] * 4,
      release = instr.i[12] * instr.i[12] * 4,
      releaseInv = 1 / release,
      expDecay = -instr.i[13] / 16,
      arp = instr.i[14],
      arpInterval = rowLen * 2 ** (2 - instr.i[15]);

    var noteBuf = new Int32Array(attack + sustain + release);

    // Re-trig oscillators
    var c1 = 0,
      c2 = 0;

    // Local variables.
    var j, j2, e, t, rsample, o1t, o2t;

    // Generate one note (attack + sustain + release)
    for (j = 0, j2 = 0; j < attack + sustain + release; j++, j2++) {
      if (j2 >= 0) {
        // Switch arpeggio note.
        arp = (arp >> 8) | ((arp & 255) << 4);
        j2 -= arpInterval;

        // Calculate note frequencies for the oscillators
        o1t = getnotefreq(n + (arp & 15) + instr.i[2] - 128);
        o2t = getnotefreq(n + (arp & 15) + instr.i[6] - 128) * (1 + 0.0008 * instr.i[7]);
      }

      // Envelope
      e = 1;
      if (j < attack) {
        e = j / attack;
      } else if (j >= attack + sustain) {
        e = (j - attack - sustain) * releaseInv;
        e = (1 - e) * 3 ** (expDecay * e);
      }

      // Oscillator 1
      c1 += o1t * e ** o1xenv;
      rsample = osc1(c1) * o1vol;

      // Oscillator 2
      c2 += o2t * e ** o2xenv;
      rsample += osc2(c2) * o2vol;

      // Noise oscillator
      if (noiseVol) {
        rsample += (2 * Math.random() - 1) * noiseVol;
      }

      // Add to (mono) channel buffer
      noteBuf[j] = (80 * rsample * e) | 0;
    }

    return noteBuf;
  };

  //--------------------------------------------------------------------------
  // Private members
  //--------------------------------------------------------------------------

  // Array of oscillator functions
  var mOscillators = [osc_sin, osc_square, osc_saw, osc_tri];

  // Private variables set up by init()
  var mSong, mLastRow, mCurrentCol, mNumWords, mMixBuf;

  //--------------------------------------------------------------------------
  // Initialization
  //--------------------------------------------------------------------------

  this.init = function (song) {
    // Define the song
    mSong = song;

    // Init iteration state variables
    mLastRow = song.endPattern;
    mCurrentCol = 0;

    // Prepare song info
    mNumWords = song.rowLen * song.patternLen * (mLastRow + 1) * 2;

    // Create work buffer (initially cleared)
    mMixBuf = new Int32Array(mNumWords);
  };

  //--------------------------------------------------------------------------
  // Public methods
  //--------------------------------------------------------------------------

  // Generate audio data for a single track
  this.generate = function () {
    // Local variables
    var i, j, b, p, row, col, n, cp, k, t, lfor, e, x, rsample, rowStartSample, f, da;

    // Put performance critical items in local variables
    var chnBuf = new Int32Array(mNumWords),
      instr = mSong.songData[mCurrentCol],
      rowLen = mSong.rowLen,
      patternLen = mSong.patternLen;

    // Clear effect state
    var low = 0,
      band = 0,
      high;
    var lsample,
      filterActive = false;

    // Clear note cache.
    var noteCache = [];

    // Patterns
    for (p = 0; p <= mLastRow; ++p) {
      cp = instr.p[p];

      // Pattern rows
      for (row = 0; row < patternLen; ++row) {
        // Execute effect command.
        var cmdNo = cp ? instr.c[cp - 1].f[row] : 0;
        if (cmdNo) {
          instr.i[cmdNo - 1] = instr.c[cp - 1].f[row + patternLen] || 0;

          // Clear the note cache since the instrument has changed.
          if (cmdNo < 17) {
            noteCache = [];
          }
        }

        // Put performance critical instrument properties in local variables
        var oscLFO = mOscillators[instr.i[16]],
          lfoAmt = instr.i[17] / 512,
          lfoFreq = 2 ** (instr.i[18] - 9) / rowLen,
          fxLFO = instr.i[19],
          fxFilter = instr.i[20],
          fxFreq = (instr.i[21] * 43.23529 * 3.141592) / 44100,
          q = 1 - instr.i[22] / 255,
          dist = instr.i[23] * 1e-5,
          drive = instr.i[24] / 32,
          panAmt = instr.i[25] / 512,
          panFreq = (6.283184 * 2 ** (instr.i[26] - 9)) / rowLen,
          dlyAmt = instr.i[27] / 255,
          dly = (instr.i[28] * rowLen) & ~1; // Must be an even number

        // Calculate start sample number for this row in the pattern
        rowStartSample = (p * patternLen + row) * rowLen;

        // Generate notes for this pattern row
        for (col = 0; col < 4; ++col) {
          n = cp ? instr.c[cp - 1].n[row + col * patternLen] : 0;
          if (n) {
            if (!noteCache[n]) {
              noteCache[n] = createNote(instr, n, rowLen);
            }

            // Copy note from the note cache
            var noteBuf = noteCache[n];
            for (j = 0, i = rowStartSample * 2; j < noteBuf.length; j++, i += 2) {
              chnBuf[i] += noteBuf[j];
            }
          }
        }

        // Perform effects for this pattern row
        for (j = 0; j < rowLen; j++) {
          // Dry mono-sample
          k = (rowStartSample + j) * 2;
          rsample = chnBuf[k];

          // We only do effects if we have some sound input
          if (rsample || filterActive) {
            // State variable filter
            f = fxFreq;
            if (fxLFO) {
              f *= oscLFO(lfoFreq * k) * lfoAmt + 0.5;
            }
            f = 1.5 * Math.sin(f);
            low += f * band;
            high = q * (rsample - band) - low;
            band += f * high;
            rsample = fxFilter == 3 ? band : fxFilter == 1 ? high : low;

            // Distortion
            if (dist) {
              rsample *= dist;
              rsample = rsample < 1 ? (rsample > -1 ? osc_sin(rsample * 0.25) : -1) : 1;
              rsample /= dist;
            }

            // Drive
            rsample *= drive;

            // Is the filter active (i.e. still audiable)?
            filterActive = rsample * rsample > 1e-5;

            // Panning
            t = Math.sin(panFreq * k) * panAmt + 0.5;
            lsample = rsample * (1 - t);
            rsample *= t;
          } else {
            lsample = 0;
          }

          // Delay is always done, since it does not need sound input
          if (k >= dly) {
            // Left channel = left + right[-p] * t
            lsample += chnBuf[k - dly + 1] * dlyAmt;

            // Right channel = right + left[-p] * t
            rsample += chnBuf[k - dly] * dlyAmt;
          }

          // Store in stereo channel buffer (needed for the delay effect)
          chnBuf[k] = lsample | 0;
          chnBuf[k + 1] = rsample | 0;

          // ...and add to stereo mix buffer
          mMixBuf[k] += lsample | 0;
          mMixBuf[k + 1] += rsample | 0;
        }
      }
    }

    // Next iteration. Return progress (1.0 == done!).
    mCurrentCol++;
    return mCurrentCol / mSong.numChannels;
  };

  // Create a AudioBuffer from the generated audio data
  // this.createAudioBuffer = function (context) {
  //   var buffer = context.createBuffer(2, mNumWords / 2, 44100);
  //   for (var i = 0; i < 2; i++) {
  //     var data = buffer.getChannelData(i);
  //     for (var j = i; j < mNumWords; j += 2) {
  //       data[j >> 1] = mMixBuf[j] / 65536;
  //     }
  //   }
  //   return buffer;
  // };

  // Create a WAVE formatted Uint8Array from the generated audio data
  this.createWave = function () {
    // Create WAVE header
    var headerLen = 44;
    var l1 = headerLen + mNumWords * 2 - 8;
    var l2 = l1 - 36;
    var wave = new Uint8Array(headerLen + mNumWords * 2);
    wave.set([
      82,
      73,
      70,
      70,
      l1 & 255,
      (l1 >> 8) & 255,
      (l1 >> 16) & 255,
      (l1 >> 24) & 255,
      87,
      65,
      86,
      69,
      102,
      109,
      116,
      32,
      16,
      0,
      0,
      0,
      1,
      0,
      2,
      0,
      68,
      172,
      0,
      0,
      16,
      177,
      2,
      0,
      4,
      0,
      16,
      0,
      100,
      97,
      116,
      97,
      l2 & 255,
      (l2 >> 8) & 255,
      (l2 >> 16) & 255,
      (l2 >> 24) & 255,
    ]);

    // Append actual wave data
    for (var i = 0, idx = headerLen; i < mNumWords; ++i) {
      // Note: We clamp here
      var y = mMixBuf[i];
      y = y < -32767 ? -32767 : y > 32767 ? 32767 : y;
      wave[idx++] = y & 255;
      wave[idx++] = (y >> 8) & 255;
    }

    // Return the WAVE formatted typed array
    return wave;
  };

  // Get n samples of wave data at time t [s]. Wave data in range [-2,2].
  // this.getData = function (t, n) {
  //   var i = 2 * Math.floor(t * 44100);
  //   var d = new Array(n);
  //   for (var j = 0; j < 2 * n; j += 1) {
  //     var k = i + j;
  //     d[j] = t > 0 && k < mMixBuf.length ? mMixBuf[k] / 32768 : 0;
  //   }
  //   return d;
  // };
};

const pixelArtLetters = {
  // 1: '010110010010111',
  // 2: '01101001001001001111',
  // 3: '11100001001100011110',
  // 4: '00110101100111110001',
  // 5: '11111000111100011110',
  // 6: '01101000111010010110',
  // 7: '11110001001000100010',
  // 8: '01101001011010010110',
  // 9: '01101001011100010110',
  // 0: '01101001100110010110',
  A: '01101001111110011001',
  B: '110101110101110',
  C: '011100100100011',
  D: '110101101101110',
  E: '111100111100111',
  F: '111100111100100',
  G: '01111000101110010110',
  H: '10011001111110011001',
  I: '111010010010111',
  // J: '00010001000110010110',
  // K: '10011010110010101001',
  L: '100100100100111',
  M: '1000111011101011000110001',
  N: '10011101101110011001',
  O: '01101001100110010110',
  P: '11101001111010001000',
  // Q: '01101001100110100101',
  R: '11101001111010101001',
  S: '01111000011000011110',
  T: '111010010010010',
  U: '10011001100110010110',
  V: '1000110001010100101000100',
  W: '1010110101101010101001010',
  // X: '10011001011010011001',
  Y: '10011001111100011110',
  // Z: '11110001011010001111',
  ' ': '000000000000000',
  // '.': '000000000000001',
  ',': '000000000100100',
  '!': '010010010000010',
  // '/': '0000100010001000100010000',
  // ':': '000010000010000',
  // x: '000000101010101',
  '^': '0010001110111110010000100', // ↑
  v: '0010000100111110111000100', // ↓
  '<': '0010001100111110110000100', // ←
  '>': '0010000110111110011000100', // →
};

/**
 * Render a single line of text
 * @param {object} options - The text rendering options
 */
function writeTextLine(opt) {
  const LETTER_HEIGHT = 5;
  let letterX = 0;

  for (let i = 0; i < opt._text.length; i++) {
    const char = opt._text.charAt(i);
    const letter = pixelArtLetters[char];
    const letterWidth = letter.length / LETTER_HEIGHT; // Calculate the width based on the total length divided by the height
    for (let y = 0; y < LETTER_HEIGHT; y++) {
      for (let x = 0; x < letterWidth; x++) {
        const pixelIndex = y * letterWidth + x;
        if (letter[pixelIndex] === '1') {
          opt.ctx.rect(
            (opt._x + (x + letterX + i)) * zoomFactor * opt._scale,
            (opt._y + y) * zoomFactor * opt._scale,
            zoomFactor * opt._scale,
            zoomFactor * opt._scale,
          );
        }
      }
    }
    letterX += letterWidth; // Increment letterX by the width of the current letter
  }
}

/**
 * Render multi-line text
 * @param {object} options - The text rendering options
 */
function writeText(options) {
  // const defaultOptions = {
  //   _x: 0,
  //   _y: 0,
  //   _text: '',
  //   _color: '#fff',
  //   _scale: 2,
  // };
  const elapsed = performance.now() - currentReadingStartTime;
  const displayedCharacterNumber = (elapsed * 0.05) | 0;
  const lines = options._text.slice(0, displayedCharacterNumber).split('|');

  const letterSize = 8;
  // Begin drawing
  ctx.beginPath();
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    writeTextLine({
      ctx,
      _x: options._x,
      _y: options._y + letterSize * i,
      _text: line,
      _scale: options._scale,
    });
  }

  ctx.fillStyle = options._color;
  ctx.fill();
}

// Call this when you set/replace the text (e.g., in your intro step apply)
function startReadingText(text) {
  currentReadingText = text;
  playActionSound('text');
  currentReadingStartTime = performance.now();
}

// Canvas variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const backgroundCanvas = document.getElementById('gameBackgroundCanvas');
const backgroundCtx = backgroundCanvas.getContext('2d');

const seasonCanvasList = {}; // ex: { summer: canvas, winter: canvas, ... }

// Global variables
let zoomFactor = 1; // Display size for each tile. Zoom whole game depending on screen size
let lastFrameTime = 0; // For animation loop
let keyStack = []; // Stack of keys pressed
const FPS = 1000 / 60; // ~16.67
let lastTimestamp = 0;
let accumulatedTime = 0;

let initialData = {
  characterX: 784, // 49 * TILE_SIZE
  characterY: 336, // 21 * TILE_SIZE
  currentSeason: 'summer',
  characterMaxLife: 3,
  availableSeasons,
  collectedCatsList: [],
};
let savedData;

let characterMaxLife;
let characterLife;
let isCharacterFalling = false;
let isInvulnerable = false;
let invulnerabilityStartTime = 0; // Start time for invulnerability
const INVULNERABILITY_FRAME_DURATION = 1500;

const collisionMaps = {};

let isFallingAnimationActive = false;
let fallAnimationStartTime = 0;
const FALL_ANIMATION_DURATION = 420;
let fallStartX = 0;
let fallStartY = 0;
let fallTargetX = 0;
let fallTargetY = 0;
let fallDx = 0;
let fallDy = 0;

let currentReadingText = '';
let currentReadingStartTime = 0; // ms from performance.now()
let seasonMusicList = {};

/**
 * Get the opposite direction
 * @param {number} direction (ORIENTATION_UP | ORIENTATION_DOWN | ORIENTATION_LEFT | ORIENTATION_RIGHT)
 * @returns {number} - The opposite direction
 */
function getOppositeDirection(direction) {
  // If direction is odd (1 or 3), toggle bit 1 (XOR with 2), else toggle bit 2 (XOR with 6)
  return direction & 1 ? direction ^ 2 : direction ^ 6;
}

let musicAudio = document.createElement('audio');
let musicplayer = new CPlayer();

let isSoundActive = true;
let isChangingSeason = false;

// --- Fade overlay ---
let isFading = false;
let fadePhase = 0; // 0=none, 1=out, 2=in
let fadeStartTime = 0;
let fadeDuration = 1000; // ms
let fadeOnMid = null; // callback appelé au switch (milieu)

function startFade(duration, onMidpoint) {
  fadeDuration = duration || 1000;
  fadeOnMid = onMidpoint || null;
  isFading = true;
  fadePhase = 1; // out
  fadeStartTime = performance.now();
}

function updateFade() {
  if (!isFading) return;

  const now = performance.now();
  const p = Math.min(1, (now - fadeStartTime) / fadeDuration);

  let alpha = fadePhase === 1 ? p : 1 - p;

  ctx.globalAlpha = alpha;
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalAlpha = 1;
  // arrivé en fin de phase
  if (p >= 1) {
    if (fadePhase === 1) {
      // out -> switch -> in
      if (typeof fadeOnMid === 'function') fadeOnMid();
      fadePhase = 0;
      fadeStartTime = now;
    } else {
      // in -> fin
      isFading = false;
      fadePhase = 0;
      fadeOnMid = null;
    }
  }
}

const worldLayers = {
  ground:
    '206,8,48,7,37,8,48,7,37,8,48,7,37,8,48,7,37,8,48,7,,4,32,8,51,,4,,33,,,,3,,4,8,42,,4,,33,19,39,10,,,30,14,2,3,39,2,,7,,,30,14,3,,51,,11,,18,2,10,2,3,,51,,11,,18,16,53,,5,,5,,18,15,52,15,17,16,90,2,21,,71,5,64,19,12,11,57,20,98,2,198,2,98,2,1431,2,97,3,,,94,6,96,2,98,2,49,2,47,2,49,2,98,2,47,6,4,4,25,5,7,6,9,6,33,2,32,,3,,12,,9,6,67,,3,,12,,9,2,71,,2,11,3,,2,9,24,,2,,10,3,5,,37,,3,,2,9,24,,3,2,7,3,6,,37,,3,,34,2,3,2,7,8,,,29,2,6,,3,,34,2,3,2,7,5,32,4,5,2,3,,34,3,2,3,43,,,8,4,,13,3,20,,14,,33,,13,,13,3,8,,27,,32,,13,,14,,9,,27,3,30,15,14,,6,7,24,3,56,7,3,7,26,,56,7,3,7,26,,56,7,3,7,26,3,54,7',
  wall: '0,43,18,40,5,,7,,23,,22,,7,,,,,,,,2,,6,,,,11,2,5,,7,,23,,22,,7,,,,,,,,2,,6,,13,2,5,,7,,23,,22,,7,,,,,,,,2,2,5,,13,2,2,,2,,7,,23,,22,,7,,,,,,,,3,4,,2,2,2,9,2,2,,2,,7,,23,,22,,7,,15,,2,2,9,2,2,,2,,7,,23,,22,,7,,15,,3,,9,2,2,,2,4,,4,8,,5,10,22,4,,4,,2,,3,8,,3,,9,2,2,,2,,16,,5,,8,,22,,10,,12,,3,,9,2,2,,2,,16,,5,,8,3,18,3,10,,11,2,3,,9,2,2,,2,,7,2,2,2,3,,5,,8,3,18,3,10,,11,,4,,9,2,2,,2,10,2,3,,2,5,,34,9,5,3,3,,4,,9,2,2,,16,,2,7,34,,,,,,,3,,5,,5,,4,9,2,2,,16,,43,,,,,,,,18,,9,2,2,,15,2,17,3,18,3,2,,,,,,,,18,,9,2,2,7,2,8,18,3,18,3,2,,,,,,,3,,16,9,2,8,4,25,,22,,2,,,,,,,,28,2,37,,22,,37,2,37,,22,,37,23,2,15,22,29,2,8,20,2,2,2,40,,21,2,2,2,26,2,2,2,40,,21,2,2,2,72,,99,,94,3,,2,94,2,98,2,98,2,98,2,536,,59,5,35,,59,5,35,,8,2,,3,45,5,35,3,11,,85,3,11,3,83,3,97,3,19,2,2,2,45,2,2,2,7,5,9,3,19,2,2,2,45,2,2,2,7,,3,,9,24,2,14,22,13,2,10,3,12,37,,22,,5,,12,,18,2,37,,22,,5,,12,,19,,23,4,3,6,,,22,,2,2,,12,,4,16,,16,3,2,3,2,,8,,,,22,,2,,13,,12,2,3,,3,,6,,,5,3,,6,,2,,8,,,4,,19,2,,13,,12,2,3,,3,,6,,5,2,,2,6,,2,,8,,,,22,,2,6,,4,3,,12,2,3,,3,,6,,5,,10,,2,,8,,,,22,,2,,,,2,,,,6,,,4,8,,3,,3,3,,4,5,,10,,2,,8,,,,22,,2,,4,3,6,,2,,9,2,3,,3,,12,,13,,8,,,,22,,2,,13,,2,,4,4,,2,3,,2,2,12,,13,4,,2,4,,22,,2,,,,8,4,,2,,4,11,3,12,3,,4,,,10,3,2,,22,,2,,,10,,2,,,17,,,4,,4,26,,2,,13,3,,6,2,,15,,9,4,,4,,,7,,26,,2,,13,3,,6,2,,15,,9,,7,,,,7,,26,,2,,12,2,8,,2,5,2,8,,,9,,7,,,,7,,17,8,,,2,,22,,6,4,6,3,9,,7,,,,7,8,2,9,6,,4,,22,,28,,7,,,,7,,6,,2,,14,,4,,22,,28,,7,,,9,5,2,2,2,13,12,4,50,15,2,2,2,24,6',
  water:
    '220,3,16,4,77,3,16,4,72,8,16,4,72,8,16,4,72,7,17,4,74,5,19,2,98,2,89,6,3,2,89,6,3,2,89,2,2,2,3,2,89,2,2,7,89,2,2,7,89,6,3,2,89,6,94,6,94,6,,4,89,6,,4,96,3,97,3,84,15,30,17,38,15,30,17,36,17,34,6,43,9,369,4,96,4,49,4,43,2,51,4,43,2,50,5,92,10,90,10,90,2,39,3,97,3,97,3,97,7,88,12,88,12,91,9,91,9,310,3,97,3,8,2,6,3,89,2,6,3,89,2,401,2,98,2,98,2,14,7,77,2,14,7,93,3,,3,270,2,98,2,98,2',
  tree: '43,,,,,,,,,,,,,,,,,,155,,,,5,,10,,,,7,,7,,4,,,,16,,18,,28,,10,,19,,40,,29,,7,,8,,9,,3,,,,73,,,,19,,40,,18,,9,,17,,9,,5,,35,,48,,7,,5,,37,,21,,6,,17,,2,,3,,2,,2,,69,,3,,13,,7,,4,,22,,14,,47,,9,,28,,4,,108,,97,,98,,,,14,,17,,14,,,,,,3,,,,,,,,72,,10,,255,,261,,45,,11,,76,,66,,33,,,,14,,6,,51,,,,24,,98,,20,,53,,26,,2,,,,,,,,,,,,,,,,61,,,,,,,,,,,,,,4,,,,2,,17,,3,,,,5,,,,,,,,,,40,,,,5,,,,9,,26,,,,11,,18,,20,,,,13,,,,,,17,,6,,13,,,,5,,,,3,,11,,,,,,19,,2,,6,,42,,3,,,,2,,19,,28,,10,,6,,7,,4,,,,2,,4,,47,,9,,71,,5,,10,,7,,3,,17,,,,,,7,,,,9,,36,,,,3,,,,,,23,,10,,,,,,5,,,,,,14,,17,,5,,10,,11,,17,,22,,22,,,,11,,10,,12,,,,,,7,,,,48,,5,,5,,152,,110,,87,,12,,27,,80,,87,,,,,,,,3,,3,,,,,,,,94,,,,,,100,,35,,,,57,,,,38,,,,98,,5,,95,,5,,16,,53,,20,,12,,34,,5,,7,,39,,58,,13,,3,,20,,46,,,,3,,,,6,,89,,61,,98,,88,,11,,5,,,,98,,80,,45,,,,,,149,,28,,2,,77,,,,11,,2,,72,,20,',
  rock: '201,,17,,81,,99,,74,2,324,,99,,99,,22,,45,,109,,226,2,2,,5,,6,3,73,,99,,111,,48,,63,2,34,,304,2,98,2,661,,,2,4,,189,2,109,,201,,322,,237,,99,2,45,,18,2,525,,98,2,23,,63,2,108,,,,72,,15,,8,,203,,28,,69,2,28,,10,,9,,,2,95,2,88,,12,2,18,,52,,114,,29,,8,2,59,,8,,101,',
  blade: '270,,,,,,11,,908,,123,,45,,,,,,118,,1661,,190,,1423,,225,',
  hole: '724,,99,,99,,3,,95,,3,,73,,21,5,572,,99,,718,2,98,2,98,2,72,,18,,80,,18,3,99,3,65,,,3,16,,79,2,16,3,656,2,98,2,98,2,98,2,250,,3,,275,2,68,,12,2,2,2,11,,69,,16,2,11,2,17,,57,,23,,17,,49,,11,,19,,67,,30,2,67,,73,2,6,3,89,,99,2,12,,86,,98,2,126,3,5,2,71,,,4,94,3',
  spikes: '203,,84,2,13,,84,2,12,,101,2,80,2,98,2,313,,288,4,409,,99,,2904,,99,,258,,99,2,98,2,,2,439,2',
  bush: '684,,294,,98,2,242,,100,2,168,2,113,,822,2,98,2,355,,99,,80,2,17,,81,,1251,2,13,,99,,99,,497,',
  snow: '445,,99,3,2,3,93,6,96,2,98,2,57,3,52,3,42,3,52,2,153,,98,2,97,3,80,,96,4,21,2,71,3,22,4,70,3,23,2,69,4,29,2,66,2,30,2,748,,99,3,98,2,86,,11,2,39,4,42,2,11,2,30,2,7,,46,,12,3,26,4,67,3,25,3,,2,68,,54,2,54,,43,2,53,3,43,,46,,5,2,91,2,5,2,91,2,44,,53,2,43,2,53,2,43,2,187,2,4,2,92,,503,2,13,3,83,,12,3,254,3,73,,24,2,23,4,46,,24,2,24,3,65,2,3,2,92,4,2,2,98,',
  root: '370,,,,,,95,,105,3,99,,368,5,99,2,106,2,98,3,30,,85,,11,3,172,,99,,98,7,935,2,98,2,99,,205,,98,2,69,2,27,,70,2,27,,116,2,99,,244,4,95,2,2,,99,3,228,2,72,2,99,,129,3,98,,99,,415,,55,3,39,3,56,2,99,,199,,99,,88,3,7,',
  mommy: '693,,83,,12,,93,,1779,,61,,207,,256,,88,,10,,101,,50,,23,,86,,211,,1160,,180,,199,',
  crack: '483,,99,,189,,99,,699,,99,,790,,99,,1045,,99,,1031,,99,,160,,99,,86,,91,,7,,30,,60,,38,,33,,99,,99,',
  checkpoint: '810,,54,,377,,99,,118,2,758,2,66,2,528,2,1301,2,149,2,1318,',
  skeleton: '2367,2,19,,182,,407,,82,,105,,465,,,,,,172,,300,,22,,,,263,,3,,300,,195,,15,,508,,57,,42,,345,2',
  trigger: '2249,,1498,,133,,36,,467,,127,,318,,407,,13,,467,,61,,55,,15,',
  seeker: '3027,,1440,,1096,',
  mushroom:
    '1717,,99,,372,2,623,3,98,2,755,3,100,,145,2,99,2,384,2,58,4,9,,496,,204,,63,,142,2,53,,,,32,,69,,29,,99,,297,2',
  stoneflower:
    '1449,2,98,2,1433,4,16,3,37,2,38,,59,2,169,3,98,2,99,,223,2,98,2,171,2,98,2,131,2,98,2,293,,563,2,17,,81,,17,,21,2,76,,100,,21,2,76,,20,2,106,',
};
let world = decodeLevel(worldLayers);

addSign(34, 24, 'BURN BUSHES AND ENEMIES|WITH FIREBALLS');
addSign(21, 23, '^ WINTER TEMPLE|v SPRING TEMPLE');
addSign(45, 11, '< WINTER TEMPLE|> SUMMER TEMPLE');
addSign(80, 35, 'STAND ON STONE|AND PRESS ACTION');
addSign(74, 25, 'v AUTUMN TEMPLE|> SUMMER TEMPLE');
addSign(73, 37, '< SPRING TEMPLE|v AUTUMN TEMPLE');
addSign(25, 36, 'v SPRING TEMPLE|^ WINTER TEMPLE');

function addSpecificWorldItems() {
  if (!availableSeasons.includes('winter')) {
    addSeasonOrb(10, 4, 'winter', 'IN WINTER, SNOW COVERS|AND WATER TURNS ICE');
  }
  if (!availableSeasons.includes('summer')) {
    addSeasonOrb(65, 4, 'summer', 'IN SUMMER, ROOTS GROW|AND USE THE VINES TO CLIMB');
  }
  if (!availableSeasons.includes('fall')) {
    addSeasonOrb(94, 57, 'fall', 'IN FALL, MUSHROOM GROW|AND LEAVES FILL HOLES');
  }
  if (!availableSeasons.includes('spring')) {
    addSeasonOrb(4, 57, 'spring', 'IN SPRING, STONE FLOWERS|BLOOM');
  }

  // Add cat list manually to move them when collected and add signs to show where they were found
  let catList = [
    { x: 81, y: 44, text: 'IN AUTUMN TEMPLE', cx: 52, cy: 25 },
    { x: 89, y: 59, text: 'IN AUTUMN TEMPLE', cx: 50, cy: 26 },
    { x: 48, y: 50, text: 'AT SOUTH', cx: 48, cy: 26 },
    { x: 26, y: 47, text: 'IN SPRING TEMPLE', cx: 46, cy: 25 },
    { x: 9, y: 31, text: 'AT WEST', cx: 45, cy: 23 },
    { x: 29, y: 5, text: 'IN WINTER TEMPLE', cx: 45, cy: 21 },
    { x: 35, y: 12, text: 'IN WINTER TEMPLE', cx: 46, cy: 19 },
    { x: 49, y: 4, text: 'AT NORTH', cx: 48, cy: 18 },
    { x: 84, y: 2, text: 'IN SUMMER TEMPLE', cx: 50, cy: 18 },
    { x: 97, y: 2, text: 'IN SUMMER TEMPLE', cx: 52, cy: 19 },
    { x: 62, y: 21, text: 'AT EAST', cx: 53, cy: 21 },
    { x: 85, y: 28, text: 'AT EAST', cx: 53, cy: 23 },
  ];

  catList.forEach((cat, index) => {
    // If cat was already collected, add it as collected (in its corner)
    if (savedData.collectedCatsList.includes(index)) {
      let catTile = { tile: 'cat', x: cat.cx, y: cat.cy, _isCollected: true };
      world.push(catTile);
    } else {
      world.push({ tile: 'cat', x: cat.x, y: cat.y, cx: cat.cx, cy: cat.cy, i: index });
      addSign(cat.cx, cat.cy, `${cat.text}`);
    }
  });
}

/**
 * Adds a seasonal orb to the level
 * @param {*} x
 * @param {*} y
 * @param {*} season
 */
function addSeasonOrb(x, y, season, text) {
  world.push({ tile: 'orb', x, y, season, text });
}

/**
 * Adds a sign to the level
 * @param {*} x
 * @param {*} y
 * @param {*} text
 */
function addSign(x, y, text) {
  world.push({ tile: 'signpanel', x, y, text }); // Adds a sign tile at the specified coordinates
}

// Generates music to preloaded audio element
function generateMusic(song) {
  musicplayer.init(song);
  while (musicplayer.generate() < 1) {} // Générer la musique
  return musicplayer.createWave(); // Retourner l'onde audio générée
}

/**
 * Play the music
 * @param {Uint8Array} wave - The wave audio data
 * @param {boolean} loop - Loop the music or not
 */
let musicChangeStartTime = 0;
function playMusic(wave, loop = false) {
  const currentPos = musicAudio.currentTime || 0; // récupérer position
  musicChangeStartTime = performance.now();
  musicAudio.src = URL.createObjectURL(new Blob([wave], { type: 'audio/wav' }));
  musicAudio.loop = loop; // Indiquer si la musique doit boucler ou non

  musicAudio.onloadedmetadata = () => {
    // si la position est plus grande que la durée, on module
    musicAudio.currentTime = (currentPos + (performance.now() - musicChangeStartTime) / 100) % musicAudio.duration;
    musicAudio.volume = isSoundActive ? 0.2 : 0;
    musicAudio.play();
  };
}

/**
 * Play the music control
 */
function playMusicControl() {
  musicAudio.play();
}

/**
 * Stop the music
 */
function stopMusic() {
  musicAudio.pause();
}

/**
 * This file contains the functions to decode the RLE string and process the sprites
 * @module 03-decoder
 */

/**
 * Decode the RLE string into an array of pixel values
 * @param {string} rleString - The RLE string to decode
 * @returns {object} - An object containing the pixel values and image width
 */
function decodeRLE(rleString) {
  const START_CHAR_CODE = 'A'.charCodeAt(0); // First character code in the RLE string
  const MAX_CHAR_PER_GROUP = 12; // _colors per group
  const pixels = [];

  const imageWidth = +rleString.match(/^\d+/)[0]; // Extract the image width
  rleString = rleString.replace(/^\d+/, '');

  for (let i = 0; i < rleString.length; ++i) {
    const char = rleString[i];
    const charCodeOffset = char.charCodeAt(0) - START_CHAR_CODE;

    // Calculating the color index and run length
    const colorIndex = (charCodeOffset / MAX_CHAR_PER_GROUP) | 0;
    const runLength = (charCodeOffset % MAX_CHAR_PER_GROUP) + 1;

    pixels.push(...Array(runLength).fill(colorIndex));
  }

  return { pixels, imageWidth };
}

/**
 * Convert a 1D array of pixels into a 2D array, given the image width
 * @param {number[]} pixels - The 1D array of pixel values
 * @param {number} imageWidth - The width of the image
 * @returns {number[][]} - A 2D array of pixel values
 */
function convertTo2DArray(pixels, imageWidth) {
  const rows = [];
  for (let i = 0; i < pixels.length; i += imageWidth) {
    rows.push(pixels.slice(i, i + imageWidth));
  }
  return rows;
}

/**
 * Slice the 2D image array into 16x16 tiles
 * @param {number[][]} image2DArray - The 2D array of pixel values
 * @param {number} tileWidth - The width of the tile
 * @param {number} tileHeight - The height of the tile
 * @returns {number[][][]} - An array of 16x16 tiles
 */
function sliceIntoTiles(image2DArray, tileWidth, tileHeight) {
  const tiles = [];
  const numRows = image2DArray.length;
  const numCols = image2DArray[0].length;

  for (let row = 0; row < numRows; row += tileHeight) {
    for (let col = 0; col < numCols; col += tileWidth) {
      const tile = [];
      for (let y = 0; y < tileHeight; y++) {
        tile.push(image2DArray[row + y].slice(col, col + tileWidth));
      }
      tiles.push(tile);
    }
  }
  return tiles;
}

/**
 * Process a sprite image and return the tiles
 * @param {string} imageKey - The key of the image in the TILE_DATA
 * @returns {object} - An object containing the tiles of the sprite
 */
function processSprite(imageKey) {
  const rleString = TILE_DATA[imageKey]._rle;
  const pixels = decodeRLE(rleString);
  const image2DArray = convertTo2DArray(pixels.pixels, pixels.imageWidth);

  const tileWidth = TILE_DATA[imageKey].size?.[0] * 16 || 16;
  const tileHeight = TILE_DATA[imageKey].size?.[1] * 16 || 16;

  return sliceIntoTiles(image2DArray, tileWidth, tileHeight);
}

// Processing all sprites
function processAllSprites() {
  for (const imageKey in TILE_DATA) {
    TILE_DATA[imageKey]._tiles = processSprite(imageKey);
  }
}

processAllSprites();

function decodeLevel(worldLayers) {
  const worldData = [];
  let tileIndex = 0;

  for (const [layerName, encodedString] of Object.entries(worldLayers)) {
    // Split on comma, and if string is empty, add 1, except for first
    const runs = encodedString.split(',').map((s, i) => +s || (i ? 1 : 0));
    let isFilled = false; // commence par vide
    for (const count of runs) {
      for (let i = 0; i < count; i++) {
        const x = tileIndex % WORLD_WIDTH;
        const y = (tileIndex / WORLD_WIDTH) | 0;
        const _moveDirection = TILE_DATA[layerName]?._moveDirection || null;
        if (isFilled) {
          worldData.push({ tile: layerName, x, y, _moveDirection });
        }
        tileIndex++;
      }
      isFilled = !isFilled;
    }

    // On reset tileIndex pour chaque layer, pour que tous utilisent la même grille
    tileIndex = 0;
  }

  return worldData;
}

function generateCollisionMapForSeason(seasonName) {
  const map = Array.from({ length: WORLD_HEIGHT }, () => Array.from({ length: WORLD_WIDTH }, () => null));
  for (const tile of world) {
    let seasonTile = getSeasonalTile(tile.tile, seasonName);
    const tileData = TILE_DATA[seasonTile];
    if (!tileData) {
      continue;
    }

    const size = tileData.size || [1, 1];

    for (let dx = 0; dx < size[0]; ++dx) {
      for (let dy = 0; dy < size[1]; ++dy) {
        const x = tile.x + dx;
        const y = tile.y + dy;

        if (x < WORLD_WIDTH && y < WORLD_HEIGHT) {
          map[y][x] = seasonTile;
        }
        if (['wall', 'snow'].includes(seasonTile)) {
          map[y + 1][x] = seasonTile;
        }
      }
    }
  }

  collisionMaps[seasonName] = map;
}

/**
 * Get the axis-aligned bounding box (AABB) for a tile
 * @param {string} tileName - The name of the tile
 * @param {number} px - The x-coordinate
 * @param {number} py - The y-coordinate
 * @returns {Object} - The AABB object with left, right, top, and bottom properties
 */
function getAABB(tileName, px, py) {
  const padding = TILE_DATA[tileName]._collisionPadding || [0, 0, 0, 0];
  return {
    l: px + padding[3],
    r: px + TILE_SIZE - padding[1],
    t: py + padding[0],
    b: py + TILE_SIZE - padding[2] + (tileName === 'character' ? TILE_SIZE / 2 : 0),
  };
}

function getTileAABB(tile) {
  return getAABB(tile.tile, tile.x * TILE_SIZE, tile.y * TILE_SIZE);
}

function getTilesInAABB(box) {
  const minX = clamp((box.l / TILE_SIZE) | 0, 0, WORLD_WIDTH - 1);
  const maxX = clamp(((box.r - 1) / TILE_SIZE) | 0, 0, WORLD_WIDTH - 1);
  const minY = clamp((box.t / TILE_SIZE) | 0, 0, WORLD_HEIGHT - 1);
  const maxY = clamp(((box.b - 1) / TILE_SIZE) | 0, 0, WORLD_HEIGHT - 1);

  const out = [];
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      out.push({ x, y });
    }
  }
  return out;
}

/**
 * Check if two AABBs overlap
 * @param {Object} a - The first AABB
 * @param {Object} b - The second AABB
 * @returns {boolean} - True if they overlap, false otherwise
 */
function aabbOverlap(a, b) {
  return !(a.r <= b.l || a.l >= b.r || a.b <= b.t || a.t >= b.b);
}

/**
 * Check if the character is touching any traps
 */
function checkDamages() {
  if (isInvulnerable) {
    return;
  }

  // Hitbox pixel perfect
  const charBox = getAABB('character', characterX, characterY);

  for (const trap of TRAP_LIST) {
    if (!trap._moveDirection) {
      continue; // Skip inactive traps
    }

    const trapPx = trap.x * TILE_SIZE;
    const trapPy = trap.y * TILE_SIZE;
    const trapBox = getAABB(trap.tile, trapPx, trapPy);

    if (aabbOverlap(charBox, trapBox)) {
      takeDamage();
      break; // one hit per frame
    }
  }

  for (const { x: tx, y: ty } of getTilesInAABB(charBox)) {
    const tileName = collisionMaps[currentSeason][ty]?.[tx];
    if (tileName !== 'spikes') {
      continue;
    }

    // Spikes don't deal damage at it's first  frame
    const spikeTile = getTileAt(tx, ty);
    if (!spikeTile || (spikeTile._animationFrame || 0) === 0) {
      continue;
    }

    const spikeBox = getAABB('spikes', tx * TILE_SIZE, ty * TILE_SIZE);
    if (aabbOverlap(charBox, spikeBox)) {
      takeDamage();
      break; // one hit per frame
    }
  }

  for (const enemy of ENEMY_LIST) {
    const tileX = enemy.x * TILE_SIZE;
    const tileY = enemy.y * TILE_SIZE;

    const enemyBox = getAABB(enemy.tile, tileX, tileY);
    if (aabbOverlap(charBox, enemyBox)) {
      takeDamage();
      break; // one hit per frame
    }
  }
}

function isLineClear(y, x1, x2) {
  if (x1 === x2) {
    return true;
  }
  const map = collisionMaps[currentSeason];
  const step = x2 > x1 ? 1 : -1;
  for (let x = x1 + step; x !== x2; x += step) {
    if (BLOCKING_TILES.includes(map[y][x])) return false;
  }
  return true;
}

function isRowClear(x, y1, y2) {
  if (y1 === y2) return true; // rien à scanner
  const map = collisionMaps[currentSeason];
  const step = y2 > y1 ? 1 : -1;
  for (let y = y1 + step; y !== y2; y += step) {
    if (BLOCKING_TILES.includes(map[y][x])) return false;
  }
  return true;
}

/**
 * Canvas rendering functions
 * @module 50-canvas
 */

/**
 * Refresh the canvas by redrawing the level and the character
 */
function refreshCanvas() {
  ctx.imageSmoothingEnabled = false;

  // If not in menu, draw the game
  drawLevel();
  drawCharacter();
  checkDamages();
  drawLife();
  writeText({ _text: currentSeason.toUpperCase(), _x: 5, _y: 5, _scale: 1.2, _color: '#000' });
  if (isDying) {
    runDieAnimation();
  }
  updateFade();
  if (currentReadingText) {
    ctx.fillStyle = '#000';
    ctx.fillRect(
      40 * zoomFactor,
      10 * zoomFactor,
      DISPLAY_WIDTH * TILE_SIZE * zoomFactor - 80 * zoomFactor,
      40 * zoomFactor,
    );
    writeText({
      _text: currentReadingText,
      _x: 24,
      _y: 9,
      _scale: 2,
      _color: '#fff',
    });
  }
}

/**
 * Draw the level background and elements
 */
function drawLevel() {
  const { offsetX, offsetY } = getCameraOffset();
  ctx.drawImage(
    seasonCanvasList[currentSeason],
    offsetX * TILE_SIZE,
    offsetY * TILE_SIZE,
    DISPLAY_WIDTH * TILE_SIZE,
    DISPLAY_HEIGHT * TILE_SIZE,
    0,
    0,
    DISPLAY_WIDTH * TILE_SIZE * zoomFactor,
    DISPLAY_HEIGHT * TILE_SIZE * zoomFactor,
  );

  ctx.save();
  ctx.scale(zoomFactor, zoomFactor); // Apply global zoom
  ctx.translate(Math.round(-offsetX * TILE_SIZE), Math.round(-offsetY * TILE_SIZE)); // Shift the view
  drawLevelElements(false);
  ctx.restore();
}

/**
 * Draw the background of the level
 * @param {string} backgroundTileName - The name of the background tile
 * @param {string} borderTileName - The name of the border tile
 */
function drawLevelBackground() {
  const seasonCanvas = seasonCanvasList[currentSeason];
  if (!seasonCanvas) return;

  // Met à jour le fond flouté
  backgroundCtx.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
  backgroundCtx.drawImage(seasonCanvas, 0, 0, backgroundCanvas.width, backgroundCanvas.height);
}

/**
 * Draw the level background elements
 * @param {boolean} isDrawingStatic - Whether to draw static elements
 * @param {CanvasRenderingContext2D} context - The canvas rendering context
 */
function drawLevelElements(isDrawingStatic = false, context = ctx) {
  const { offsetX, offsetY } = getCameraOffset();
  const minX = (offsetX | 0) - 1,
    minY = (offsetY | 0) - 1;
  const maxX = minX + DISPLAY_WIDTH + 2;
  const maxY = minY + DISPLAY_HEIGHT + 2;

  world.forEach((element) => {
    // If element is not visible on screen, skip it
    if (!isDrawingStatic && (element.x < minX || element.x > maxX || element.y < minY || element.y > maxY)) {
      return;
    }

    let displayedTile = getSeasonalTile(element.tile);
    let _colors;

    if (!displayedTile) {
      return;
    }

    const tile = TILE_DATA[displayedTile];

    // Draw only static or dynamic tiles, depending on isDrawingStatic parameter
    if ((isDrawingStatic && !tile._isStatic) || (!isDrawingStatic && tile._isStatic)) {
      return;
    }

    // Flip the cat based on the character's position to make it face the right direction
    if (displayedTile === 'cat' && !isPlayingCinematic) {
      element._flipHorizontally = characterX / TILE_SIZE < element.x;
    }

    if (['water', 'ice'].includes(displayedTile)) {
      const { type, _orientation } = getTileTypeAndOrientation(element);
      element._animationFrame = type + 4 * (element._animationStep || 0); // Use animation step for water animation
      element._orientation = _orientation;
    }

    if (['wall', 'snow'].includes(element.tile)) {
      const { type, _orientation } = getWallTypeAndOrientation(element);
      element._animationFrame = type;
      element._orientation = _orientation;
      const belowY = element.y + 1;
      if (!getTileAt(element.x, belowY)) {
        const leftWall = getTileAt(element.x - 1, element.y)?.tile === element.tile;
        const rightWall = getTileAt(element.x + 1, element.y)?.tile === element.tile;

        // Choose the thickness frame based on the wall's surroundings
        let thicknessFrameIndex = 5; // default segment (left+right)
        let _flipHorizontally = false;

        if (!leftWall && rightWall) {
          thicknessFrameIndex = 4; // left corner
        } else if (leftWall && !rightWall) {
          thicknessFrameIndex = 4; // right corner = left corner + mirror
          _flipHorizontally = true;
        } else if (!leftWall && !rightWall) {
          // isolated: can keep 5 (small segment), or 4 depending on your art.
          thicknessFrameIndex = 6;
        }
        const thicknessFrame = tile._tiles[thicknessFrameIndex];
        drawTile(thicknessFrame, getColors(tile._colors), element.x, belowY, {
          _orientation: ORIENTATION_UP,
          _flipHorizontally,
          context,
        });
      }
    }

    const frame = tile._tiles[element._animationFrame || 0]; // Get the current frame
    _colors = getColors(TILE_DATA[displayedTile]._colors);

    if (element.tile === 'orb') {
      // Orb color is orb's season
      _colors = getColors(TILE_DATA[displayedTile]._colors, element.season);
    }

    const x = element.x;
    const y = element.y;
    const _orientation = element._orientation || ORIENTATION_UP;
    const _scale = element.scale || 1;
    const _flipHorizontally = element._flipHorizontally;
    drawTile(frame, _colors, x, y, { _orientation, _scale, context, _flipHorizontally });
  });
}

/**
 * Get the _colors for a tile, taking into account the current season if indexed number, else return the color as is
 * @param {*} _colors
 * @returns
 */
function getColors(_colors, seasonName = currentSeason) {
  // if _colors are numbers, get their corresponding color from the season
  return _colors.map((colorIndex) => '#' + (COLOR_SETS[seasonName][colorIndex] || colorIndex));
}

function getSeasonalTile(tileName, season = currentSeason) {
  if (HIDE_UNLESS[tileName] && HIDE_UNLESS[tileName] !== season) {
    return '';
  }
  return (SEASON_REPLACE[season] && SEASON_REPLACE[season][tileName]) || tileName;
}

/**
 * Draw a tile on the canvas at the specified position, color, and optional transformations
 * @param {number[][]} tile - The tile to draw (required)
 * @param {string[]} _colors - The _colors for the tile (required)
 * @param {number} x - The x-coordinate of the tile (required)
 * @param {number} y - The y-coordinate of the tile (required)
 * @param {Object} [options={}] - Optional parameters: _orientation, _scale, context, _flipHorizontally
 * @param {number} [options._orientation=ORIENTATION_UP] - The _orientation of the tile
 * @param {number} [options._scale=1] - The _scale to apply to the tile
 * @param {CanvasRenderingContext2D} [options.context=ctx] - The canvas context to draw on
 * @param {boolean} [options._flipHorizontally=false] - Whether to flip the tile horizontally
 */
function drawTile(tile, _colors, x, y, options = {}) {
  const {
    _orientation = ORIENTATION_UP,
    _scale = tile._scale || 1,
    context = ctx,
    _flipHorizontally = false,
    alpha = 1,
  } = options;
  context.save();

  const halfTileSize = TILE_SIZE / 2;
  context.translate(Math.floor((x + 0.5) * TILE_SIZE), Math.floor((y + 0.5) * TILE_SIZE));

  // Apply horizontal flip if necessary
  let scaleDirection = 1;
  if (_flipHorizontally) {
    scaleDirection = -1;
  }

  context.scale(_scale * scaleDirection, _scale); // Apply scaling
  context.rotate(((_orientation - 1) * Math.PI) / 2); // Apply rotation
  context.translate(-halfTileSize, -halfTileSize); // Move to the top-left corner of the tile
  context.globalAlpha = alpha;

  // Draw the tile by iterating over the pixels
  for (let tileY = 0; tileY < tile.length; tileY++) {
    for (let tileX = 0; tileX < tile[tileY].length; tileX++) {
      const pixelValue = tile[tileY][tileX];
      if (pixelValue > 0) {
        // Skip transparent pixels (0)
        context.fillStyle = _colors[pixelValue - 1];
        // Draw the pixel
        context.fillRect(tileX, tileY, 1, 1);
      }
    }
  }

  context.restore();
}

/**
 * Get the tile type and _orientation for a given element
 * @param {*} element - The element to check
 * @returns {Object} - An object containing the tile type and _orientation
 */
function getTileTypeAndOrientation(element) {
  let x = element.x;
  let y = element.y;
  const isSameTile = (tx, ty) => !!getTileAt(tx, ty, [element.tile]);

  const n = isSameTile(x, y - 1);
  const s = isSameTile(x, y + 1);
  const w = isSameTile(x - 1, y);
  const e = isSameTile(x + 1, y);
  const nw = isSameTile(x - 1, y - 1);
  const ne = isSameTile(x + 1, y - 1);
  const sw = isSameTile(x - 1, y + 1);
  const se = isSameTile(x + 1, y + 1);

  let type = 3; // fill by default
  let _orientation = 0;

  const neighbors = { nw, ne, sw, se, n, s, e, w };

  // Every neighbor is water: fill
  if (Object.values(neighbors).every(Boolean)) {
    return { type: 3, _orientation: ORIENTATION_UP };
  }

  // Inner corner: one empty among the corners
  const corners = [
    { key: 'nw', _orientation: ORIENTATION_UP },
    { key: 'ne', _orientation: ORIENTATION_RIGHT },
    { key: 'se', _orientation: ORIENTATION_DOWN },
    { key: 'sw', _orientation: ORIENTATION_LEFT },
  ];

  const emptyCorners = corners.filter((c) => !neighbors[c.key]);
  const filledEdges = [n, s, e, w].filter(Boolean).length;

  if (emptyCorners.length === 1 && filledEdges === 4) {
    const { _orientation } = emptyCorners[0];
    return { type: 2, _orientation };
  }

  // Edge: one side empty among N/S/E/W
  const cardinal = [
    { key: 'n', _orientation: ORIENTATION_UP },
    { key: 'e', _orientation: ORIENTATION_RIGHT },
    { key: 's', _orientation: ORIENTATION_DOWN },
    { key: 'w', _orientation: ORIENTATION_LEFT },
  ];

  const emptyCardinal = cardinal.filter((c) => !neighbors[c.key]);
  const filledCardinal = cardinal.filter((c) => neighbors[c.key]);

  if (emptyCardinal.length === 1 && filledCardinal.length === 3) {
    const { _orientation } = emptyCardinal[0];
    return { type: 1, _orientation };
  }

  // Outer corner: two adjacent sides + their corner filled
  if (n && w && nw) {
    return { type: 0, _orientation: ORIENTATION_DOWN };
  }
  if (n && e && ne) {
    return { type: 0, _orientation: ORIENTATION_LEFT };
  }
  if (s && e && se) {
    return { type: 0, _orientation: ORIENTATION_UP };
  }
  if (s && w && sw) {
    return { type: 0, _orientation: ORIENTATION_RIGHT };
  }

  return { type, _orientation };
}

function getWallTypeAndOrientation(element) {
  const { x, y, tile } = element;
  const isSame = (tx, ty) => !!getTileAt(tx, ty, [tile]);

  const n = isSame(x, y - 1) ? 1 : 0;
  const e = isSame(x + 1, y) ? 1 : 0;
  const s = isSame(x, y + 1) ? 1 : 0;
  const w = isSame(x - 1, y) ? 1 : 0;

  const bits = n + e + s + w;

  // 1 neighbor: border
  if (bits === 1) {
    return {
      type: 0,
      _orientation: e ? ORIENTATION_UP : s ? ORIENTATION_RIGHT : w ? ORIENTATION_DOWN : ORIENTATION_LEFT,
    };
  }

  // 2 neighbors: segment
  if (e && w && !n && !s) return { type: 1, _orientation: ORIENTATION_UP }; // horizontal
  if (n && s && !e && !w) return { type: 1, _orientation: ORIENTATION_RIGHT }; // vertical

  // 3 neighbors: T
  if (bits === 3) {
    return {
      type: 2,
      _orientation: !n ? ORIENTATION_UP : !e ? ORIENTATION_RIGHT : !s ? ORIENTATION_DOWN : ORIENTATION_LEFT,
    };
  }

  // corners (2 adjacent neighbors)
  if (bits === 2) {
    if (e && s) return { type: 3, _orientation: ORIENTATION_LEFT }; // ES
    if (s && w) return { type: 3, _orientation: ORIENTATION_UP }; // SW
    if (w && n) return { type: 3, _orientation: ORIENTATION_RIGHT }; // WN
    if (n && e) return { type: 3, _orientation: ORIENTATION_DOWN }; // NE
  }

  // fallback
  return { type: 1, _orientation: ORIENTATION_UP };
}

function getCameraOffset() {
  const viewWidth = DISPLAY_WIDTH * TILE_SIZE;
  const viewHeight = DISPLAY_HEIGHT * TILE_SIZE;

  // Center the camera on the character
  let camX = characterX - viewWidth / 2;
  let camY = characterY - viewHeight / 2;

  // Clamp to avoid exceeding world bounds
  const maxCamX = WORLD_WIDTH * TILE_SIZE - viewWidth;
  const maxCamY = WORLD_HEIGHT * TILE_SIZE - viewHeight;

  camX = clamp(camX, 0, maxCamX);
  camY = clamp(camY, 0, maxCamY);
  return { offsetX: camX / TILE_SIZE, offsetY: camY / TILE_SIZE };
}

function preRenderSeasonBackgrounds() {
  seasonList.forEach((seasonName) => {
    currentSeason = seasonName;
    // Crée un canvas pour cette saison
    const canvas = document.createElement('canvas');
    canvas.width = WORLD_WIDTH * TILE_SIZE;
    canvas.height = WORLD_HEIGHT * TILE_SIZE;

    const ctx = canvas.getContext('2d');
    seasonCanvasList[seasonName] = canvas;

    ctx.fillStyle = '#' + COLOR_SETS[seasonName][3];
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const backgroundTileName = 'grass'; // Default background tile

    const backgroundTile = TILE_DATA[backgroundTileName]._tiles[0];
    let backgroundColors = getColors(TILE_DATA[backgroundTileName]._colors, seasonName);

    const plantTile = TILE_DATA['plant']._tiles[0];
    let plantColors = getColors(TILE_DATA['plant']._colors, seasonName);

    for (let y = 0; y < WORLD_HEIGHT; y++) {
      for (let x = 0; x < WORLD_WIDTH; x++) {
        if (((x - 812347 * y) * 928371 * (x + 156468 + y)) % 17 === 0) {
          drawTile(plantTile, plantColors, x, y, { context: ctx });
        } else {
          drawTile(backgroundTile, backgroundColors, x, y, { context: ctx });
        }
      }
    }

    // Draw all static elements
    drawLevelElements(true, ctx);
  });
}

const TRAP_LIST = [];
function setTrapList() {
  world.forEach((tile) => {
    if (['blade', 'seeker'].includes(tile.tile)) {
      TRAP_LIST.push(tile);
    }
  });
}

const ENEMY_LIST = [];
function setEnemyList() {
  world.forEach((tile) => {
    if (['skeleton', 'mommy'].includes(tile.tile)) {
      ENEMY_LIST.push(tile);
    }
  });
}

let CAT_LIST = [];
function setCatList() {
  world.forEach((tile) => {
    if (['cat'].includes(tile.tile)) {
      CAT_LIST.push(tile);
    }
  });
}

/**
 * Get the tile coordinates from a pixel value
 * @param {number} val - The pixel value
 * @returns {number} - The tile coordinate
 */
const getTileCoord = (val) => (val / TILE_SIZE) | 0;

/**
 * Get the tile at the specified position
 * @param {number} x - The x-coordinate
 * @param {number} y - The y-coordinate
 * @returns {string} - The name of the tile at this position or null if no element is found
 */
function getTileAt(x, y, type = []) {
  // Reversed loop to get topmost element
  for (let index = world.length - 1; index >= 0; --index) {
    const element = world[index];
    if (element.x === x && element.y === y && (type.length === 0 || type.includes(element.tile))) {
      return element;
    }
  }
  return null;
}

/**
 * Remove a specific tile or multiple tiles from the level.
 * @param {string} tileName - The name of the tile to remove (e.g., "gong").
 * @param {number} [x] - The x-coordinate of the tile to remove.
 * @param {number} [y] - The y-coordinate of the tile to remove.
 */
function removeTile(tileName, x, y) {
  world = world.filter((element) => {
    // Remove tile if it matches the name and, if provided, coordinates
    return element.tile !== tileName || element.x !== x || element.y !== y;
  });
}

/**
 * Add a new tile to the level data
 * @param {string} tile - The name of the tile to add
 * @param {number} x - The x-coordinate of the tile
 * @param {number} y - The y-coordinate of the tile
 * @param {object} [options] - Additional options for the tile
 */
function addTile(tile, x, y, options = {}) {
  world[options.isUnder ? 'unshift' : 'push']({ tile, x, y, ...options });
  return world[options.isUnder ? 0 : world.length - 1];
}

/**
 * Get the direction offsets for movement
 * @param {number} direction - The direction to get offsets for
 * @returns {object} - The x and y offsets for the direction
 */
function getDirectionOffsets(direction) {
  return {
    dx: (direction === ORIENTATION_RIGHT) - (direction === ORIENTATION_LEFT),
    dy: (direction === ORIENTATION_DOWN) - (direction === ORIENTATION_UP),
  };
}

let isFireballLaunched = false;

// Handle keyboard input for character movement
function handleGameKeydown(key) {
  if (key && !keyStack.includes(key) && ['up', 'down', 'left', 'right'].includes(key)) {
    keyStack.push(key);
  }

  if (key === 'action' && !isPlayingCinematic) {
    if (currentReadingText) {
      currentReadingText = '';
    } else {
      tryReadSign();
      if (
        !tryChangeSeason() &&
        !isChangingSeason &&
        !currentReadingText &&
        !isFireballLaunched &&
        !isPlayingCinematic
      ) {
        isFireballLaunched = true;
        launchFireball();
      }
    }
  }
}

function handleGameKeyup(key) {
  if (key) {
    const index = keyStack.indexOf(key);
    if (index !== -1) {
      keyStack.splice(index, 1); // Remove the key from the stack
    }
  }
  if (key === 'action') {
    isFireballLaunched = false;
  }
}

// Map keys to movement directions
function mapKeyToDirection(key) {
  switch (key) {
    case 'ArrowUp':
    case 'z':
    case 'w':
      return 'up';
    case 'ArrowDown':
    case 's':
      return 'down';
    case 'ArrowLeft':
    case 'q':
    case 'a':
      return 'left';
    case 'ArrowRight':
    case 'd':
      return 'right';
    case 'Enter':
    case ' ':
      return 'action';
    default:
      return key;
  }
}

/**
 * Character
 * This file contains the logic for moving the character on the grid and performing actions
 * @module 50-character
 */

// Initialize the character on the grid at the start of the game
let characterScale = 1;
let characterFlipHorizontally = false;
let characterDirection; // Track the current direction
let characterX;
let characterY;
let characterSpeed = 1; // en pixels par frame
let isCharacterMoving;
let characterMoveFrame = 0; // Frame of the character sprite to show
let characterMoveElapsedTime;
let isCharacterDisplayed = true;

/**
 * Draw the character sprite on the canvas
 */
function drawCharacter() {
  if (!isCharacterDisplayed) {
    // during intro, character is not shown at every frame
    return;
  }

  const { offsetX, offsetY } = getCameraOffset();

  const drawX = characterX - offsetX * TILE_SIZE;
  const drawY = characterY - offsetY * TILE_SIZE;

  const characterTile = TILE_DATA['character']._tiles[characterMoveFrame];
  let characterColors = getColors(TILE_DATA['character']._colors);

  if (isInvulnerable) {
    const now = performance.now();
    if (Math.floor((now - invulnerabilityStartTime) / 200) % 2 === 0) {
      characterColors = getColors(COLOR_SETS['winter']);
    }
  }

  ctx.save();
  ctx.scale(zoomFactor, zoomFactor);
  ctx.translate(drawX, drawY);
  drawTile(characterTile, characterColors, 0, 0, {
    _scale: characterScale,
    _flipHorizontally: characterFlipHorizontally,
  });
  ctx.restore();
}

/**
 * Check if the character can move to the specified position
 * @param {string} tileName - The name of the tile
 * @param {number} x - The x-coordinate
 * @param {number} y - The y-coordinate
 * @param {number} dx - The x-direction of movement
 * @param {number} dy - The y-direction of movement
 * @returns {tile || null} - The tile at the destination or null if not blocked
 */
function getTileAtDestination(tileName, x, y, canFall = true) {
  const map = collisionMaps[currentSeason];

  // 1) Détection de blocage via AABB + tuiles recouvertes
  const blockBox = getAABB(tileName, x, y); // inclut le _collisionPadding du tileName
  for (const { x: tx, y: ty } of getTilesInAABB(blockBox)) {
    if (tx < 0 || ty < 0 || tx >= WORLD_WIDTH || ty >= WORLD_HEIGHT) return false;
    const tile = map[ty][tx];
    if (BLOCKING_TILES.includes(tile)) {
      return { x: tx, y: ty, tile }; // tuile bloquante rencontrée
    }
  }

  if (!canFall) return null;

  // 2) Détection de chute (plus clémente) via une AABB "HOLE_PADDING"
  const fallBox = {
    l: x + HOLE_PADDING[3],
    r: x + TILE_SIZE - HOLE_PADDING[1],
    t: y + HOLE_PADDING[0] + TILE_SIZE * 0.8,
    b: y + TILE_SIZE - HOLE_PADDING[2] + TILE_SIZE * 0.8,
  };
  for (const { x: tx, y: ty } of getTilesInAABB(fallBox)) {
    if (tx < 0 || ty < 0 || tx >= WORLD_WIDTH || ty >= WORLD_HEIGHT) continue;
    const tile = map[ty][tx];
    if (tile === 'hole' || tile === 'water') {
      takeDamage();
      triggerFallAnimation(x, y);
      return { x: tx, y: ty, tile };
    }
  }

  return null;
}

function triggerFallAnimation(targetX, targetY) {
  isCharacterFalling = true;
  isFallingAnimationActive = true;

  playActionSound('fall');
  fallAnimationStartTime = performance.now();

  fallStartX = characterX;
  fallStartY = characterY;

  // Calcule la direction de chute
  fallDx = Math.sign(targetX - characterX);
  fallDy = Math.sign(targetY - characterY);

  // Cible de l'animation visuelle de chute
  fallTargetX = characterX + fallDx * TILE_SIZE * 0.5;
  fallTargetY = characterY + fallDy * TILE_SIZE * 0.5;
  if (fallDy > 0) {
    fallTargetY += TILE_SIZE * 0.2;
  }
}

function respawnCharacter(targetX, targetY) {
  characterX = targetX;
  characterY = targetY;
}

function setCharacterDirection(direction) {
  characterDirection = direction;
  characterMoveFrame = getMoveFrameFromDirection(characterDirection);
}

function getMoveFrameFromDirection(direction) {
  switch (direction) {
    case ORIENTATION_UP:
      return 1;
    case ORIENTATION_RIGHT:
    case ORIENTATION_LEFT:
      return 2;
    case ORIENTATION_DOWN:
      return 0;
  }
}

function tryPerformCharacterAction() {
  // Try picking cat
  const interactBox = {
    l: characterX + HOLE_PADDING[3],
    r: characterX + TILE_SIZE - HOLE_PADDING[1],
    t: characterY + HOLE_PADDING[0],
    b: characterY + TILE_SIZE - HOLE_PADDING[2] + TILE_SIZE / 2,
  };

  for (const { x: tileX, y: tileY } of getTilesInAABB(interactBox)) {
    // Cat tile found: collect it
    let catTile = getTileAt(tileX, tileY, ['cat']);
    if (catTile && !catTile._isCollected) {
      catTile.x = catTile.cx;
      catTile.y = catTile.cy;
      catTile._isCollected = true;
      removeTile('signpanel', catTile.cx, catTile.cy);
      savedData.collectedCatsList.push(catTile.i);
      // if last cat collected, start outro
      if (savedData.collectedCatsList.length >= CAT_LIST.length) {
        startOutro();
      }
    }
    if (getTileAt(tileX, tileY, ['orb'])) {
      characterMaxLife += 1;
      let tile = getTileAt(tileX, tileY, ['orb']);
      const unlockedSeason = tile.season;
      changeSeason(unlockedSeason);
      availableSeasons.push(unlockedSeason);
      removeTile('orb', tileX, tileY);
      startReadingText(tile.text);
    }
    // Sets new respawn point when checkpoint is reached
    if (getTileAt(tileX, tileY, ['checkpoint'])) {
      saveGame();
    }

    // Checks if a trap can be triggered
    TRAP_LIST.forEach((trap) => {
      if (trap._moveDirection) {
        return;
      }

      // Triggers trap if character is at same row or line, and no obstacle is in between
      if (trap.x === tileX && isRowClear(tileX, tileY, trap.y)) {
        trap._moveDirection = tileY < trap.y ? ORIENTATION_UP : ORIENTATION_DOWN;
      } else if (trap.y === tileY && isLineClear(tileY, tileX, trap.x)) {
        trap._moveDirection = tileX < trap.x ? ORIENTATION_LEFT : ORIENTATION_RIGHT;
      }
      if (trap._moveDirection) {
        playActionSound('seeker', true);
      }
    });
  }
}

function launchFireball() {
  let { dx, dy } = getDirectionOffsets(characterDirection);
  let x = characterX / TILE_SIZE + (dx * 0.5 || 0.1);
  let y = characterY / TILE_SIZE - (dy > 0 ? -0.8 : 0) + Math.abs(dx) * 0.5;

  let fireballTile = addTile('fireball', x, y);
  fireballTile._moveDirection = characterDirection;
  return true;
}

function tryReadSign() {
  if (characterDirection !== ORIENTATION_UP) {
    return;
  }
  const tileX = getTileCoord(characterX + TILE_SIZE / 2);
  const tileY = getTileCoord(characterY + TILE_SIZE / 4);

  const tile = getTileAt(tileX, tileY, ['signpanel']);
  if (tile?.text) {
    startReadingText(tile?.text);
  }
  return !!currentReadingText;
}

/**
 * If player is on a trigger and press action, change to next available season
 */
function tryChangeSeason() {
  if (!availableSeasons.length || isChangingSeason) {
    return false;
  }
  const charBox = getAABB('character', characterX, characterY);
  for (const { x: tx, y: ty } of getTilesInAABB(charBox)) {
    const tile = getTileAt(tx, ty, ['trigger']);
    let nextSeason = availableSeasons[(availableSeasons.indexOf(currentSeason) + 1) % availableSeasons.length];
    if (tile) {
      changeSeason(nextSeason);
      return true;
    }
  }
  return false;
}

let isDying = false;
let deathStartTime = 0;
const DEATH_SPIN_INTERVAL = 100; // ms

function drawLife() {
  const heartTile = TILE_DATA['heart']._tiles[0];
  const heartColors = getColors(TILE_DATA['heart']._colors);
  for (let i = 0; i < characterMaxLife; ++i) {
    const y = 1 * zoomFactor; // Position the hearts at the top
    // and right of canvas
    const x = (DISPLAY_WIDTH - i - 1) * TILE_SIZE;
    ctx.save();
    ctx.scale(zoomFactor, zoomFactor);
    ctx.translate(x, y);
    drawTile(heartTile, [heartColors[0], heartColors[i < characterLife ? 1 : 2]], 0, 0);
    ctx.restore();
  }
}

function takeDamage() {
  if (isInvulnerable) {
    return;
  }
  playActionSound('damage');
  --characterLife;
  isInvulnerable = true;
  invulnerabilityStartTime = performance.now();
  setTimeout(() => {
    isInvulnerable = false;
  }, INVULNERABILITY_FRAME_DURATION);
  if (characterLife <= 0) {
    // Trigger game over or respawn
    isDying = true;
  }
}

function runDieAnimation() {
  const elapsed = performance.now() - deathStartTime;

  // Spin : change d’orientation toutes les 100ms
  setCharacterDirection((Math.floor(elapsed / DEATH_SPIN_INTERVAL) % 4) + 1);

  // Quand scale est 0, on lance le fade + respawn au midpoint
  if (!isFading) {
    startFade(1500, () => {
      // Respawn (aux coords initiales du level)
      characterX = savedData.characterX;
      characterY = savedData.characterY;
      characterLife = characterMaxLife;
      currentSeason = savedData.currentSeason;
      setCharacterDirection(ORIENTATION_DOWN);
    });

    // déverrouille un poil après le fade-in
    setTimeout(() => {
      isDying = false;
    }, 1000);
  }

  // on “bloque” la marche animée pour éviter les frames de pas
  walkAnimationTimer = 0;
  walkFrameIndex = 0;
}

/**
 * Canvas animations functions to change tile frames and animate the level
 * @module 51-canvas-animations
 */

/**
 * Main animation loop
 * @param {number} timestamp - The current timestamp
 */

function animate(ts) {
  if (!lastTimestamp) lastTimestamp = ts;
  let frameMs = ts - lastTimestamp;

  // clamp to avoid huge jumps
  if (frameMs > 100) {
    frameMs = 100;
  }

  lastTimestamp = ts;
  accumulatedTime += frameMs;

  // 💡 exécute 0, 1 ou plusieurs updates **avec un delta constant**
  while (accumulatedTime >= FPS) {
    // 👉 Si updateAnimations attend des **ms** :
    updateAnimations(FPS);

    // 👉 Si updateFallAnimation utilise un timestamp absolu, tu peux l’appeler ici
    //    ou en dehors; comme elle est basée sur performance.now(), elle restera stable :
    updateFallAnimation(ts);

    accumulatedTime -= FPS;
  }

  // Un seul rendu par frame écran
  refreshCanvas();
  updateCinematic(frameMs, ts);
  handleGamepadInput();
  requestAnimationFrame(animate);
}

/**
 * Update the animation frames of all animated tiles
 * @param {number} deltaTime - The time elapsed since the last frame
 */
let triggerCurrentSeasonIndex = 0;
function updateAnimations(deltaTime) {
  world.forEach((tile) => {
    // Checks tiles which have multiple frames to animate them
    if (TILE_DATA[tile.tile]._animationSpeed) {
      tile.elapsed = (tile.elapsed || 0) + deltaTime;
      const interval = TILE_DATA[tile.tile]._animationSpeed;
      if (tile.elapsed >= interval) {
        if (tile.tile === 'trigger') {
          if (availableSeasons.length > 1) {
            // Trigger animation change it's 4th colour between all available seasons
            triggerCurrentSeasonIndex = (triggerCurrentSeasonIndex + 1) % availableSeasons.length;
            TILE_DATA[tile.tile]._colors[3] = COLOR_SETS[availableSeasons[triggerCurrentSeasonIndex]][4];
            // tile._colors[3] = COLOR_SETS[availableSeasons[triggerCurrentSeasonIndex]];
          }
        } else if (TILE_DATA[tile.tile]._tiles.length < 2) {
          tile._flipHorizontally = !tile._flipHorizontally;
        }
        tile._animationFrame = (tile._animationFrame + 1) % TILE_DATA[tile.tile]._tiles.length || 0;
        tile._animationStep = ((tile._animationStep || 0) + 1) % 2;
        tile.elapsed = 0;
      }
    }

    // Checks tiles which have a direction to move
    let _moveDirection = tile._moveDirection;
    if (_moveDirection) {
      let { dx, dy } = getDirectionOffsets(_moveDirection);
      let _moveSpeed = TILE_DATA[tile.tile][tile.isReturning ? '_returningMoveSpeed' : '_moveSpeed'] || 1;
      let nextX = tile.x + (dx * _moveSpeed) / deltaTime;
      let nextY = tile.y + (dy * _moveSpeed) / deltaTime;

      tile.x = nextX;
      tile.y = nextY;

      let destinationTile = getTileAtDestination(tile.tile, nextX * TILE_SIZE, nextY * TILE_SIZE, false);
      if (destinationTile) {
        if (tile.tile === 'fireball') {
          tile._moveDirection = null; // Stop moving if blocked
          // Remove fireball from the world
          removeTile('fireball', tile.x, tile.y);
          if (['bush', 'flower'].includes(destinationTile.tile)) {
            removeTile(
              destinationTile.tile == 'flower' ? 'stoneflower' : destinationTile.tile,
              destinationTile.x,
              destinationTile.y,
            );
            Object.keys(collisionMaps).forEach((season) => {
              collisionMaps[season][destinationTile.y][destinationTile.x] = null;
            });
          }
        }
        if (tile.tile === 'seeker') {
          tile._moveDirection = null; // Stop moving if blocked
          tile.x = Math.round(tile.x);
          tile.y = Math.round(tile.y);
          // Stops sound
          audioElements['seeker'].pause();
        }
        if (tile.tile === 'blade') {
          if (!tile.isReturning) {
            tile.isReturning = true;
            audioElements['seeker'].pause();
            // Moves in opposite direction
            tile._moveDirection = getOppositeDirection(tile._moveDirection);
          } else {
            tile.isReturning = false;
            tile._moveDirection = null;
          }
          tile.x = Math.round(tile.x);
          tile.y = Math.round(tile.y);
        }
        if (['skeleton', 'mommy'].includes(tile.tile)) {
          tile._moveDirection = getOppositeDirection(tile._moveDirection);
          tile.x = Math.round(tile.x);
          tile.y = Math.round(tile.y);
        }
      }

      // Checks if a fireball hits an enemy to remove him
      if (tile.tile === 'fireball') {
        const fireballBox = getAABB('fireball', tile.x * TILE_SIZE, tile.y * TILE_SIZE);
        for (let i = ENEMY_LIST.length - 1; i >= 0; --i) {
          const enemy = ENEMY_LIST[i];
          const enemyBox = getAABB(enemy.tile, enemy.x * TILE_SIZE, enemy.y * TILE_SIZE);
          if (aabbOverlap(fireballBox, enemyBox)) {
            // retire la mommy du niveau + de la liste dynamique
            removeTile(enemy.tile, enemy.x, enemy.y);
            ENEMY_LIST.splice(i, 1);

            // retire la fireball aussi
            removeTile('fireball', tile.x, tile.y);
            break;
          }
        }
      }
    }
  });

  if (
    !isPlayingCinematic &&
    !isCharacterFalling &&
    !isFading &&
    !isDying &&
    keyStack.length > 0 &&
    !currentReadingText
  ) {
    let dx = 0;
    let dy = 0;

    if (keyStack.length > 0) {
      // Regarde les deux dernières touches pressées
      const directions = keyStack.slice(-2).reverse(); // plus récente en premier

      for (const dir of directions) {
        switch (dir) {
          case 'left':
            if (dx === 0) dx = -1;
            break;
          case 'right':
            if (dx === 0) dx = 1;
            break;
          case 'up':
            if (dy === 0) dy = -1;
            break;
          case 'down':
            if (dy === 0) dy = 1;
            break;
        }
      }
    }

    // Normalise le vecteur pour éviter la double vitesse en diagonale
    if (dx !== 0 || dy !== 0) {
      const nextX = characterX + dx * characterSpeed;
      const nextY = characterY + dy * characterSpeed;
      let hasMovedHorizontally = false;
      let hasMovedVertically = false;

      // Check horizontal movement
      if (characterX !== nextX) {
        if (!getTileAtDestination('character', nextX, characterY)) {
          characterX = nextX;
          hasMovedHorizontally = true;
        } else if (!isCharacterFalling) {
          // If cannot move but is near a free tile, try to move vertically
          if (!getTileAtDestination('character', nextX, characterY + 5)) {
            characterY += 1;
            hasMovedVertically = true;
          } else if (!getTileAtDestination('character', nextX, characterY - 5)) {
            characterY -= 1;
            hasMovedVertically = true;
          }
        }
      }

      if (!hasMovedVertically) {
        if (!getTileAtDestination('character', characterX, nextY)) {
          characterY = nextY;
        } else if (!hasMovedHorizontally && !isCharacterFalling) {
          if (!getTileAtDestination('character', characterX + 5, nextY)) {
            characterX += 1;
          } else if (!getTileAtDestination('character', characterX - 5, nextY)) {
            characterX -= 1;
          }
        }
      }

      // Set character direction from last pressed key
      for (let i = keyStack.length - 1; i >= 0; i--) {
        switch (keyStack[i]) {
          case 'left':
            setCharacterDirection(ORIENTATION_LEFT);
            i = -1;
            break;
          case 'right':
            setCharacterDirection(ORIENTATION_RIGHT);
            i = -1;
            break;
          case 'up':
            setCharacterDirection(ORIENTATION_UP);
            i = -1;
            break;
          case 'down':
            setCharacterDirection(ORIENTATION_DOWN);
            i = -1;
            break;
        }
      }

      tryPerformCharacterAction();

      updateCharacterWalkAnimation(deltaTime);
    }
  }
}

let walkAnimationTimer = 0;
let walkFrameIndex = 0;
const WALK_FRAME_INTERVAL = 120;

function updateCharacterWalkAnimation(dt) {
  walkAnimationTimer += dt;
  const base = getMoveFrameFromDirection(characterDirection);
  const horiz = characterDirection === ORIENTATION_LEFT || characterDirection === ORIENTATION_RIGHT;

  if (horiz) {
    // left/right: alternate frame 0/1
    characterFlipHorizontally = characterDirection === ORIENTATION_RIGHT;
  }

  if (walkAnimationTimer >= WALK_FRAME_INTERVAL) {
    walkAnimationTimer = 0;

    if (horiz) {
      // left/right: alternate frame 0/1
      walkFrameIndex ^= 1; // toggle 0<->1
      characterFlipHorizontally = characterDirection === ORIENTATION_RIGHT;
    } else {
      // up/down: don't change frame, just toggle flip
      characterFlipHorizontally = !characterFlipHorizontally;
    }
  }

  // frame à afficher
  characterMoveFrame = horiz ? base + walkFrameIndex : base;
}

function updateFallAnimation(timestamp) {
  if (!isFallingAnimationActive) {
    return;
  }

  const elapsed = timestamp - fallAnimationStartTime;
  const progress = clamp(elapsed / FALL_ANIMATION_DURATION, 0, 1);

  // Déplacement progressif vers le trou
  characterX = fallStartX + (fallTargetX - fallStartX) * progress;
  characterY = fallStartY + (fallTargetY - fallStartY) * progress;
  // Échelle du perso
  characterScale = 1 - progress;

  if (progress >= 1) {
    isFallingAnimationActive = false;
    isCharacterFalling = false;
    characterScale = 1;

    // Respawn 3 pixels en arrière
    const respawnX = (fallTargetX - fallDx * TILE_SIZE * 0.7) | 0;
    const respawnY = (fallTargetY - fallDy * TILE_SIZE * 0.7) | 0;
    respawnCharacter(respawnX, respawnY);
  }
}

// Continuous FX flags for a step
const FX_FLIP = 1; // 0001 toggle characterFlipHorizontally
const FX_CYCLE_SEASONS = 2; // 0010 currentSeason = seasonList[(elapsed/800)|0 % seasonList.length]
const FX_DANSE = 4; // 0100
let isPlayingCinematic = false;
let introStepIndex = -1;
let introTimeLeft = 0;
let introFxMask = 0;
let introIsTransitioning = false; // true while a fade is in progress
let currentCinematic;

// Cinematic Steps:
//  _dur(ms) | _x | _y | _season | _text (-1 clears) | _showChar(0/1) | _orientation | _fx | _fade(ms)
const INTRO_STEPS = [
  { _dur: 2000, _x: 784, _y: 336, _orientation: ORIENTATION_LEFT, _showChar: 1, _fx: FX_FLIP, _season: 2 },
  { _dur: 5000, _text: 'MY CATS VANISHED|I MUST SAVE THEM!', _orientation: ORIENTATION_DOWN, _season: 2 },
  { _dur: 2500, _showChar: 0, _text: 'THEY ARE ACROSS THE WORLD', _x: 1360, _y: 440, _season: 0 },
  { _dur: 2500, _x: 560, _y: 184, _season: 3 },
  { _dur: 6000, _x: 144, _y: 488, _text: 'OH NO! THE SEASONS ARE IN CHAOS!', _fx: FX_CYCLE_SEASONS, _season: 0 },
  { _dur: 1500, _x: 16, _y: 16, _text: 'FIND SEASON ORBS IN TEMPLES|SAVE THE CATS', _fade: 750, _season: 3 },
  { _dur: 1500, _x: 1024, _fade: 750, _season: 1 },
  { _dur: 1500, _x: 1400, _y: 872, _fade: 750, _season: 2 },
  { _dur: 1500, _x: 16, _fade: 750, _season: 0 },
  {
    _dur: 2000,
    _x: 784,
    _y: 336,
    _season: 1,
    _text: 'MOVE WITH ARROWS|ACTION TO INTERACT',
    _showChar: 1,
    _fade: 1000,
  },
  { _dur: 2000, _text: '', _season: 1 },
];

const OUTRO_STEPS = [
  {
    _dur: 20000000, // Long duration, no one will wait that long
    _x: 784,
    _y: 336,
    _orientation: ORIENTATION_LEFT,
    _showChar: 1,
    _fx: FX_DANSE,
    _season: 2,
    _fade: 1000,
    _text: 'CONGRATS! YOU FOUND ALL THE CATS!',
  },
];

function startIntro() {
  isPlayingCinematic = true;
  introStepIndex = -1;
  introIsTransitioning = false;
  currentCinematic = INTRO_STEPS;
  _cinematicNextStep();
}

function startOutro() {
  isPlayingCinematic = true;
  introStepIndex = -1;
  introIsTransitioning = false;
  currentCinematic = OUTRO_STEPS;
  _cinematicNextStep();
}

function updateCinematic(deltaMs, elapsedSinceIntroStartMs) {
  // If intro is not active, do nothing
  if (!isPlayingCinematic) {
    return;
  }

  // If we're currently in a fade transition, don't advance the timer/steps.
  if (introIsTransitioning) return;

  introTimeLeft -= deltaMs;

  // Continuous FX during the current step
  if (introFxMask & FX_FLIP) {
    characterFlipHorizontally = elapsedSinceIntroStartMs % 500 < 250;
  }
  if (introFxMask & FX_CYCLE_SEASONS) {
    let frequency = 800;
    const i = ((elapsedSinceIntroStartMs / frequency) | 0) % seasonList.length;
    currentSeason = seasonList[i];
  }
  if (introFxMask & FX_DANSE) {
    let frequency = 5000;
    const i = ((elapsedSinceIntroStartMs / frequency) | 0) % seasonList.length;
    currentSeason = seasonList[i];
    // flip and change direction
    characterFlipHorizontally = elapsedSinceIntroStartMs % 500 < 250;
    setCharacterDirection((((elapsedSinceIntroStartMs / 1400) | 0) % 3) + 1);
    CAT_LIST.forEach((cat) => {
      cat._flipHorizontally = ((elapsedSinceIntroStartMs / 700) | 0) % 2;
    });
  }

  if (introTimeLeft <= 0) {
    _cinematicNextStep();
  }
}

// --- Internal ----------------------------------------------------------------

function _cinematicNextStep() {
  ++introStepIndex;
  if (introStepIndex >= currentCinematic.length) {
    currentReadingText = '';
    isPlayingCinematic = false;
    return;
  }

  const step = currentCinematic[introStepIndex];

  // Applies the step content and arms the timer AFTER the fade (if any)
  const applyStep = () => {
    if (step._x) {
      characterX = step._x;
    }
    if (step._y) {
      characterY = step._y;
    }
    currentSeason = seasonList[step._season];

    if (step._showChar != null) {
      isCharacterDisplayed = !!step._showChar;
    }

    if (step._orientation) {
      setCharacterDirection(step._orientation);
    }
    if (step._text) {
      startReadingText(step._text);
    }

    introFxMask = step._fx | 0;
    introTimeLeft = step._dur | 0;
  };

  if (step._fade) {
    // Lock progression until the fade completes, then apply and unlock.
    introIsTransitioning = true;
    startFade(step._fade, () => {
      applyStep();
      introIsTransitioning = false;
    });
  } else {
    applyStep();
  }
}

function handleKeyDown(e) {
  const key = mapKeyToDirection(e.key);
  handleInput(key);
}

function handleKeyUp(e) {
  const key = mapKeyToDirection(e.key);
  handleRelease(key);
}

function handleInput(input) {
  handleGameKeydown(input);
}

function handleRelease(input) {
  handleGameKeyup(input);
}

let gamepadButtonState = Array(16).fill(false); // Save the state of the buttons to avoid multiple inputs
let gamepadIndex = null; // Save the index of the gamepad
const gamepadButtonMapping = {
  12: 'up', // D-Pad Up
  13: 'down', // D-Pad Down
  14: 'left', // D-Pad Left
  15: 'right', // D-Pad Right
  0: 'action', // Bouton A
};

// Check for gamepad connection
window.addEventListener('gamepadconnected', (e) => {
  // Check if the gamepad is a standard gamepad
  if (e.gamepad.mapping !== 'standard') {
    return;
  }
  gamepadIndex = e.gamepad.index;
});

// Check for gamepad disconnection
window.addEventListener('gamepaddisconnected', (e) => {
  if (e.gamepad.index === gamepadIndex) {
    gamepadIndex = null;
  }
});

function handleGamepadInput() {
  const gamepads = navigator.getGamepads();
  if (!gamepads) {
    return;
  }

  const gamepad = gamepads[gamepadIndex]; // Get the gamepad
  if (gamepad) {
    for (let i = 0; i < gamepad.buttons.length; i++) {
      // Ignore buttons that are not mapped
      if (!gamepadButtonMapping[i]) {
        continue;
      }
      const buttonPressed = gamepad.buttons[i].pressed;

      // If the button is pressed -> keydown
      if (buttonPressed && !gamepadButtonState[i]) {
        handleInput(gamepadButtonMapping[i]);
      }

      // If the button was pressed before but not anymore -> keyup
      if (!buttonPressed && gamepadButtonState[i]) {
        handleRelease(gamepadButtonMapping[i]);
      }

      // Update the state of the button
      gamepadButtonState[i] = buttonPressed;
    }
  }
}

// Base song data (common to both intro and loop)
let seasonEnvRelease = [20, 45, 70, 90];
let envRelease = seasonEnvRelease[0];

var baseSong = {
  songData: [
    {
      // Instrument 0
      i: [
        1, // OSC1_WAVEFORM
        152, // OSC1_VOL
        128, // OSC1_SEMI
        0, // OSC1_XENV
        1, // OSC2_WAVEFORM
        20, // OSC2_VOL
        128, // OSC2_SEMI
        9, // OSC2_DETUNE
        0, // OSC2_XENV
        0, // NOISE_VOL
        7, // ENV_ATTACK
        23, // ENV_SUSTAIN
        0, // ENV_RELEASE
        0, // ENV_EXP_DECAY
        0, // ARP_CHORD
        0, // ARP_SPEED
        0, // LFO_WAVEFORM
        0, // LFO_AMT
        0, // LFO_FREQ
        0, // LFO_FX_FREQ
        2, // FX_FILTER
        255, // FX_FREQ
        0, // FX_RESONANCE
        0, // FX_DIST
        32, // FX_DRIVE
        47, // FX_PAN_AMT
        3, // FX_PAN_FREQ
        24, // FX_DELAY_AMT
        2, // FX_DELAY_TIME
      ],

      // Patterns
      p: [1],
      // Columns
      c: [
        {
          n: [
            142,
            ,
            139,
            ,
            ,
            ,
            142,
            ,
            138,
            ,
            146,
            ,
            ,
            ,
            144,
            ,
            142,
            ,
            139,
            ,
            ,
            ,
            135,
            ,
            134,
            ,
            139,
            141,
            146,
            ,
            144,
            ,
            142,
            ,
            ,
            ,
            144,
            ,
            146,
            ,
            147,
            ,
            149,
            ,
            151,
            ,
            152,
            ,
            154,
            ,
            ,
            ,
            152,
            ,
            148,
            ,
            151,
            ,
            ,
            ,
            149,
            ,
            ,
            ,
            156,
            ,
            152,
            ,
            ,
            ,
            151,
            ,
            150,
            ,
            158,
            159,
            158,
            ,
            156,
            ,
            154,
            ,
            151,
            ,
            ,
            ,
            154,
            ,
            148,
            ,
            156,
            157,
            156,
            ,
            154,
            ,
            154,
            ,
            152,
            ,
            151,
            ,
            152,
            ,
            156,
            ,
            159,
            ,
            163,
            ,
            161,
            ,
            159,
            ,
            163,
            ,
            161,
            ,
            ,
            ,
            166,
            ,
            ,
            ,
            161,
          ],
          f: [],
        },
      ],
    },
    {
      // Instrument 1
      i: [
        1, // OSC1_WAVEFORM
        192, // OSC1_VOL
        128, // OSC1_SEMI
        0, // OSC1_XENV
        1, // OSC2_WAVEFORM
        191, // OSC2_VOL
        116, // OSC2_SEMI
        9, // OSC2_DETUNE
        0, // OSC2_XENV
        0, // NOISE_VOL
        6, // ENV_ATTACK
        25, // ENV_SUSTAIN
        34, // ENV_RELEASE
        0, // ENV_EXP_DECAY
        0, // ARP_CHORD
        0, // ARP_SPEED
        0, // LFO_WAVEFORM
        69, // LFO_AMT
        2, // LFO_FREQ
        1, // LFO_FX_FREQ
        1, // FX_FILTER
        23, // FX_FREQ
        167, // FX_RESONANCE
        0, // FX_DIST
        32, // FX_DRIVE
        77, // FX_PAN_AMT
        6, // FX_PAN_FREQ
        25, // FX_DELAY_AMT
        6, // FX_DELAY_TIME
      ],
      // Patterns
      p: [1],
      // Columns
      c: [
        {
          n: [
            123,
            ,
            127,
            ,
            118,
            ,
            127,
            ,
            122,
            ,
            127,
            ,
            123,
            ,
            127,
            ,
            123,
            ,
            127,
            ,
            117,
            ,
            127,
            ,
            122,
            ,
            126,
            ,
            118,
            ,
            126,
            ,
            123,
            ,
            127,
            ,
            118,
            ,
            127,
            ,
            122,
            ,
            126,
            ,
            117,
            ,
            126,
            ,
            125,
            ,
            128,
            ,
            120,
            ,
            128,
            ,
            118,
            ,
            120,
            ,
            122,
            ,
            118,
            ,
            128,
            ,
            132,
            ,
            123,
            ,
            128,
            ,
            122,
            ,
            129,
            ,
            126,
            ,
            129,
            ,
            127,
            ,
            130,
            ,
            122,
            ,
            130,
            ,
            120,
            ,
            127,
            ,
            124,
            ,
            127,
            ,
            125,
            ,
            128,
            ,
            120,
            ,
            128,
            ,
            125,
            ,
            128,
            ,
            120,
            ,
            119,
            ,
            118,
            ,
            125,
            ,
            113,
            ,
            125,
            ,
            118,
            ,
            118,
            ,
            120,
            ,
            122,
          ],
          f: [],
        },
      ],
    },
  ],
  rowLen: 5513, // In sample lengths
  patternLen: 128, // Rows per pattern
  endPattern: 0, // End pattern
  numChannels: 2, // Number of channels
};

/**
 * @module sfx
 */
let soundList = {
  text: {
    songData: [
      {
        // Instrument 0
        i: [
          0, // OSC1_WAVEFORM
          255, // OSC1_VOL
          152, // OSC1_SEMI
          0, // OSC1_XENV
          0, // OSC2_WAVEFORM
          255, // OSC2_VOL
          152, // OSC2_SEMI
          12, // OSC2_DETUNE
          0, // OSC2_XENV
          0, // NOISE_VOL
          8, // ENV_ATTACK
          9, // ENV_SUSTAIN
          12, // ENV_RELEASE
          196, // ENV_EXP_DECAY
          0, // ARP_CHORD
          0, // ARP_SPEED
          0, // LFO_WAVEFORM
          0, // LFO_AMT
          0, // LFO_FREQ
          0, // LFO_FX_FREQ
          2, // FX_FILTER
          94, // FX_FREQ
          0, // FX_RESONANCE
          0, // FX_DIST
          32, // FX_DRIVE
          47, // FX_PAN_AMT
          9, // FX_PAN_FREQ
          5, // FX_DELAY_AMT
          2, // FX_DELAY_TIME
        ],
        // Patterns
        p: [1],
        // Columns
        c: [{ n: [123, 123, , 123, 123, 123, 123], f: [] }],
      },
    ],
    rowLen: 4410, // In sample lengths
    patternLen: 32, // Rows per pattern
    endPattern: 0, // End pattern
    numChannels: 1, // Number of channels
  },
  damage: {
    songData: [
      {
        // Instrument 0
        i: [
          0, // OSC1_WAVEFORM
          255, // OSC1_VOL
          106, // OSC1_SEMI
          64, // OSC1_XENV
          0, // OSC2_WAVEFORM
          255, // OSC2_VOL
          106, // OSC2_SEMI
          0, // OSC2_DETUNE
          64, // OSC2_XENV
          0, // NOISE_VOL
          5, // ENV_ATTACK
          7, // ENV_SUSTAIN
          111, // ENV_RELEASE
          47, // ENV_EXP_DECAY
          0, // ARP_CHORD
          0, // ARP_SPEED
          0, // LFO_WAVEFORM
          0, // LFO_AMT
          0, // LFO_FREQ
          0, // LFO_FX_FREQ
          2, // FX_FILTER
          255, // FX_FREQ
          0, // FX_RESONANCE
          2, // FX_DIST
          32, // FX_DRIVE
          83, // FX_PAN_AMT
          5, // FX_PAN_FREQ
          25, // FX_DELAY_AMT
          1, // FX_DELAY_TIME
        ],
        // Patterns
        p: [1],
        // Columns
        c: [{ n: [158], f: [] }],
      },
    ],
    rowLen: 4410, // In sample lengths
    patternLen: 32, // Rows per pattern
    endPattern: 0, // End pattern
    numChannels: 1, // Number of channels
  },
  fall: {
    songData: [
      {
        // Instrument 0
        i: [
          0, // OSC1_WAVEFORM
          255, // OSC1_VOL
          106, // OSC1_SEMI
          64, // OSC1_XENV
          0, // OSC2_WAVEFORM
          255, // OSC2_VOL
          106, // OSC2_SEMI
          0, // OSC2_DETUNE
          64, // OSC2_XENV
          0, // NOISE_VOL
          5, // ENV_ATTACK
          20, // ENV_SUSTAIN
          132, // ENV_RELEASE
          0, // ENV_EXP_DECAY
          0, // ARP_CHORD
          0, // ARP_SPEED
          0, // LFO_WAVEFORM
          0, // LFO_AMT
          0, // LFO_FREQ
          0, // LFO_FX_FREQ
          2, // FX_FILTER
          255, // FX_FREQ
          0, // FX_RESONANCE
          2, // FX_DIST
          32, // FX_DRIVE
          83, // FX_PAN_AMT
          5, // FX_PAN_FREQ
          25, // FX_DELAY_AMT
          1, // FX_DELAY_TIME
        ],
        // Patterns
        p: [1],
        // Columns
        c: [{ n: [161], f: [] }],
      },
    ],
    rowLen: 4410, // In sample lengths
    patternLen: 32, // Rows per pattern
    endPattern: 0, // End pattern
    numChannels: 1, // Number of channels
  },
  seeker: {
    songData: [
      {
        // Instrument 0
        i: [
          3, // OSC1_WAVEFORM
          0, // OSC1_VOL
          128, // OSC1_SEMI
          0, // OSC1_XENV
          3, // OSC2_WAVEFORM
          68, // OSC2_VOL
          128, // OSC2_SEMI
          0, // OSC2_DETUNE
          64, // OSC2_XENV
          218, // NOISE_VOL
          20, // ENV_ATTACK
          0, // ENV_SUSTAIN
          44, // ENV_RELEASE
          21, // ENV_EXP_DECAY
          0, // ARP_CHORD
          0, // ARP_SPEED
          1, // LFO_WAVEFORM
          55, // LFO_AMT
          4, // LFO_FREQ
          1, // LFO_FX_FREQ
          2, // FX_FILTER
          67, // FX_FREQ
          115, // FX_RESONANCE
          124, // FX_DIST
          190, // FX_DRIVE
          67, // FX_PAN_AMT
          6, // FX_PAN_FREQ
          39, // FX_DELAY_AMT
          1, // FX_DELAY_TIME
        ],
        // Patterns
        p: [1],
        // Columns
        c: [{ n: [135, 147], f: [] }],
      },
    ],
    rowLen: 5513, // In sample lengths
    patternLen: 2, // Rows per pattern
    endPattern: 0, // End pattern
    numChannels: 1, // Number of channels
  },
};

let audioElements = {};

function preloadSFX() {
  for (let key in soundList) {
    let audio = document.createElement('audio');
    let soundPlayer = new CPlayer();

    // Initialise et génère le son
    soundPlayer.init(soundList[key]);
    while (soundPlayer.generate() < 1) {}

    // Crée l'onde sonore et stocke l'audio
    var wave = soundPlayer.createWave();
    audio.src = URL.createObjectURL(new Blob([wave], { type: 'audio/wav' }));
    audioElements[key] = audio;
  }
}

function playActionSound(tile, loop = false) {
  if (audioElements[tile]) {
    audioElements[tile].currentTime = 0; // Remet à zéro pour rejouer
    audioElements[tile].loop = loop;
    audioElements[tile].play();
  }
}

function setZoomFactor() {
  zoomFactor = Math.min(
    (window.innerWidth / (DISPLAY_WIDTH * TILE_SIZE)) | 0,
    ((window.innerHeight * 0.89) / (DISPLAY_HEIGHT * TILE_SIZE)) | 0,
  );
  canvas.width = DISPLAY_WIDTH * TILE_SIZE * zoomFactor;
  canvas.height = DISPLAY_HEIGHT * TILE_SIZE * zoomFactor;

  // background canvas has same ratio than canvas but cover window size
  if (window.innerWidth / window.innerHeight > DISPLAY_WIDTH / DISPLAY_HEIGHT) {
    backgroundCanvas.width = window.innerWidth;
    backgroundCanvas.height = window.innerWidth * (DISPLAY_HEIGHT / DISPLAY_WIDTH);
  } else {
    backgroundCanvas.height = window.innerHeight;
    backgroundCanvas.width = window.innerHeight * (DISPLAY_WIDTH / DISPLAY_HEIGHT);
  }
}

window.addEventListener('resize', () => {
  setZoomFactor();
  drawLevelBackground();
});

function initMusic() {
  // Générer l'intro et la boucle au chargement
  seasonList.forEach((season, index) => {
    baseSong.songData[0].i[12] = seasonEnvRelease[index];
    seasonMusicList[season] = generateMusic(baseSong);
  });
}

function playSeasonMusic() {
  playMusic(seasonMusicList[currentSeason], true);

  if (isSoundActive) {
    playMusicControl();
  } else {
    stopMusic();
  }
}

function loadGame() {
  // Adjust the canvas size to fit the level size
  setZoomFactor();
  preloadSFX();
  initMusic();
  setTrapList();
  setEnemyList();
  loadInitialState();
  addSpecificWorldItems();
  setCatList();
  seasonList.forEach((season) => {
    generateCollisionMapForSeason(season);
  });
  preRenderSeasonBackgrounds();
  drawLevelBackground();
  currentSeason = savedData.currentSeason;
  playSeasonMusic();
  // if no save, play intro
  if (!loadSaveData()?.characterMaxLife) {
    startIntro();
  }
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);
  requestAnimationFrame(animate);
}

function changeSeason(seasonName) {
  // Heals while changing season
  characterLife = characterMaxLife;
  isChangingSeason = true;

  startFade(1000, () => {
    currentSeason = seasonName;
    playSeasonMusic();
    drawLevelBackground();
    saveGame();
    isChangingSeason = false;
  });
}

function saveGame() {
  savedData = {
    characterX: characterX,
    characterY: characterY,
    currentSeason,
    characterMaxLife,
    availableSeasons,
    collectedCatsList: savedData.collectedCatsList,
  };
  localStorage.setItem('witchcat', JSON.stringify(savedData));
}

function loadInitialState(isNew = false) {
  savedData = isNew ? { ...initialData } : { ...initialData, ...loadSaveData() };
  ({ characterX, characterY, currentSeason, characterMaxLife, availableSeasons } = savedData);
  characterLife = characterMaxLife;
}

function loadSaveData() {
  try {
    return JSON.parse(localStorage.getItem('witchcat')) || {};
  } catch {
    return {};
  }
}

loadGame();
