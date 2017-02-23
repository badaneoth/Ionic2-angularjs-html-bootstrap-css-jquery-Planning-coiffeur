





<?php
/**
 * Created by PhpStorm.
 * User: badane
 * Date: 23/01/2017
 * Time: 03:35
 */
function conc ($chaine)
{
    $j=0;
  $ch []=null;
    $i=strlen( $chaine);
    while (($j<$i))
    {
        $ch=$ch + "$chaine[i]";
       echo "$ch";
        $j++;
    }
}
conc("abcd");