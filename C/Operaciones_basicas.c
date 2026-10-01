#include <stdio.h>
#include <stdlib.h>

void suma(int v1,int v2){
    printf("%d+%d=%d\n",v1,v2,v1+v2);
}
void suma_arreglo(int *arr, int tam){
    int acum = 0;
    for(int i = 0; i < tam; i++){
        printf("%d", arr[i]);
        acum += arr[i];
        if(i < tam - 1)
            printf("+");
    }
    printf("=%d\n", acum);
}
void resta(int v1,int v2){
    printf("%d-%d=%d\n",v1,v2,v1-v2);
}
void resta_arreglo(int *arr, int tam){
    int acum = 0;
    for(int i = 0; i < tam; i++){
        printf("%d", arr[i]);
        acum -= arr[i];
        if(i < tam - 1)
            printf("-");
    }
    printf("=%d\n", acum);
}
void multiplicacion(int v1,int v2){
    printf("%d*%d=%d\n",v1,v2,v1*v2);
}
void multiplicacion_arreglo(int *arr, int tam){
    int acum = 0;
    for(int i = 0; i < tam; i++){
        printf("%d", arr[i]);
        acum *= arr[i];
        if(i < tam - 1)
            printf("*");
    }
    printf("=%d\n", acum);
}
void division(int v1,int v2){
    printf("%d/%d=%d\n",v1,v2,v1/v2);
}
void division_arreglo(int *arr, int tam){
    int acum = 0;
    for(int i = 0; i < tam; i++){
        printf("%d", arr[i]);
        acum /= arr[i];
        if(i < tam - 1)
            printf("/");
    }
    printf("=%d\n", acum);
}
int main()
{
    int op = -1;
    int v1 = 5;
    int v2 = 2;
    int *arreglo=NULL;
    int tam_arreglo = 0;
    int temp = -1;
    printf("Bienvenido\n");

    while(op < 0 || op > 7){
        printf("1.- Variables Definidas n1 = %d ; n2 = %d\n",v1,v2);
        printf("2.- Solicitud de números\n");
        printf("3.- Menu de operaciones\n");
        printf("4.- Ingreso de números\n");
        printf("5.- Expresión Aritmetica\n");
        printf("6.- Validaciones\n");
        printf("0.- Salir/Terminar\n");

        printf("Selecciona una opción: ");
        scanf("%d", &op);

        if(op >= 0 && op <= 6)
            break;
        else
            printf("Selecciona una opción valida.\n");
    }
    if(op == 1){
        suma(v1,v2);
        resta(v1,v2);
        multiplicacion(v1,v2);
        division(v1,v2);
    }
    else if(op == 2){
        printf("Ingresa el valor de n1:");
        scanf("%d",&v1);
        printf("Ingresa el valor de n2:");
        scanf("%d",&v2);
        printf("\n");
        suma(v1,v2);
        resta(v1,v2);
        multiplicacion(v1,v2);
        division(v1,v2);
    }
    else if(op == 3){
        int op2=-1;
        while(op2 < 0 || op2 > 7){
            printf("1.- Suma\n");
            printf("2.- Resta\n");
            printf("3.- Multiplicación\n");
            printf("4.- División\n");
            printf("Selecciona una opción: ");
            scanf("%d", &op2);
    
            if(op2 >= 0 && op2 <= 6)
                break;
            else
                printf("Selecciona una operación valida.\n");
        }
        switch(op2){
            case 1:
                suma(v1,v2);
                break;
            case 2:
                resta(v1,v2);
                break;
            case 3:
                multiplicacion(v1,v2);
                break;
            case 4:
                division(v1,v2);
                break;
            default:
                printf("Error en las opciones\n");
        }
    }
    else if(op == 4){
        while (1) {
            printf("Ingresa un número: ");
            scanf("%d", &temp);
            if (temp == 0)
                break;
            tam_arreglo++;
            arreglo = realloc(arreglo, tam_arreglo * sizeof(int));
            if (arreglo == NULL) {
                printf("Error: No hay suficiente memoria.\n");
                return 1;
            }
            arreglo[tam_arreglo - 1] = temp;
        }
        suma_arreglo(arreglo,tam_arreglo);
        resta_arreglo(arreglo,tam_arreglo);
        division_arreglo(arreglo,tam_arreglo);
        multiplicacion_arreglo(arreglo,tam_arreglo);
    }

    return 0;
}
