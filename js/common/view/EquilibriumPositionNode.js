// Copyright 2015-2020, University of Colorado Boulder

/**
 * Vertical dashed line that denotes the equilibrium position of a spring or system of springs.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import hookesLaw from '../../hookesLaw.js';
import HookesLawColors from '../HookesLawColors.js';

class EquilibriumPositionNode extends Line {

  /**
   * @param {number} length
   * @param {Object} [options]
   */
  constructor( length, options ) {

    options = merge( {
      stroke: HookesLawColors.EQUILIBRIUM_POSITION,
      lineWidth: 2,
      lineDash: [ 3, 3 ],
      tandem: Tandem.OPTIONAL // because this node is used to create icons
    }, options );

    super( 0, 0, 0, length, options );
  }
}

hookesLaw.register( 'EquilibriumPositionNode', EquilibriumPositionNode );

export default EquilibriumPositionNode;