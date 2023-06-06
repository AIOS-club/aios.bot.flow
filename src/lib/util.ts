export function IsRelativePathEqual(a: string, b: string) {
    let x = new URL(a, 'http://127.0.0.1').toString();
    let y = new URL(b, 'http://127.0.0.1').toString();
    return x === y;
}
