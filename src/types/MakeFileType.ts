/**
 * Type used for creating files with the `make` command.
 */
export default interface MakeFile {
    name: string;
    file: string;
    method: () => void;
}
