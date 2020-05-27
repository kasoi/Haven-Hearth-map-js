<?php

for ($i = 0; $i < 5; $i++)
{
    $num = $i + 2;
    echo "unzipping ".$num."... <br/>";
    unzip("".$num);
}

function unzip($folder)
{

    $currentfolder = realpath($folder);

    $dir = $currentfolder;
    $leave_files = array('merged_map.zip', 'lmao.php', 'cache_ver.js');

    foreach( glob("$dir/*") as $file ) {
        if( !in_array(basename($file), $leave_files) )
            unlink($file);
    }

    $zipurl = "".$currentfolder.'/merged_map.zip';
    $zip = new ZipArchive();
    $res = $zip->open($zipurl);
    echo "<a href='".$zipurl."'>(file)</a>";
    if ($res === TRUE) {
      $zip->extractTo($currentfolder.'/');
      $zip->close();
      echo 'woot!';
    } else {
      echo 'doh!';
    }

}

?>