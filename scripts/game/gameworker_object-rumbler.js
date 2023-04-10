
{
    /**
     * 
     * @param {Rumbler} rumbler 
     * @returns {Sequence}
     */
    function terrestrialSequence(rumbler) {
        const terrestrial = new Sequence('terrestrial');

        //land sequence 
        const land = terrestrial.create('land', function(config) {
            rumbler.bottom = World.GROUND_LEVEL;
        });

        land.update = function(config) {
            if(rumbler.bottom < World.GROUND_LEVEL) return this.parent.signal('air');
            config.world.applyFriction(rumbler, config.ms);
        }
        //air sequence
        const air = terrestrial.create('air', function(config) {

        });

        air.update = function(config) {
            config.world.applyGravity(rumbler, config.ms);
        }
        //return
        terrestrial.signal('land');
        return terrestrial;
    }

    class EnergyPool {

        #data; 

        constructor(data, values) {
            this.#data = data;
            this.#data.set(values);
        }

        get max_health( ) {return this.#data[0]}
        get max_spirit( ) {return this.#data[1]}    

        get current_health( ) {return this.#data[2]}
        set current_health(n) {
            n = Math.min(this.max_health, n);
            n = Math.max(0, n);
            this.#data[2] = n;
        }

        get grey_health( )    {return this.#data[3]}
        set grey_health(n)    {
            n = Math.min(this.current_health, n);
            n = Math.max(0, n);
            this.#data[3] = n;
        }

        get spirit( ) {return this.#data[4]}
        set spirit(n) {
            n = Math.min(this.max_spirit, n);
            n = Math.max(0, n);
            this.#data[4] = n;
        }
        
    }

    class Rumbler extends GameObject {

        #terrestial_sequence;
        #energy;

        constructor(config) {
            super(config.name, config.width, config.height);
            this.#energy = new EnergyPool(this.data_buffer.createInt16(5));
            this.#terrestial_sequence = terrestrialSequence(this);
        }

        get terrestrial_sequence( ) { return this.#terrestial_sequence }

        get root_type ( ) { return 'palette-texture' }

        wrap( ) {
            return Object.assign(GameObject.prototype.wrap.call(this), {
                terrestrial_sequence: this.#terrestial_sequence.current,
                root_type: this.root_type,
                health: this.#energy.current_health,
                grey_health: this.#energy.grey_health,
                energy: this.#energy.spirit
            });
        }

    }

    self.Rumbler = Rumbler;
}