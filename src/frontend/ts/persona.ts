/**
 * persona.ts 
 *
 * @link   https://github.com/AndreGarciaC/DAW_workspace/blob/master/src/frontend/ts/persona.ts
 * @file   This file defines the Persona class.
 * @author Andrea García.
 * @since  2022.10.17
 */
class Persona{
  private nombre: string; 
  public edad: number;

  constructor(nombre: string) {
    this.nombre = nombre;

}

public getNombre():string {
    return this.nombre;
}

public toString(): string{
    return `Nombre: ${this.nombre} Edad:  ${this.edad}`;
}

}